/*
 * @Author : leaf.fly
 * @Create : 2019-05-23 13:23
 * @Desc : this is class named cup for do beset logic
 * @Version : v1.0.0.20190523
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package cup

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
	path2 "path"
	"reflect"
	"strings"
	"time"
	"web-cup/controller"
	"web-cup/lib/session"
	"web-cup/lib/session/store"
)

type allocate struct {
	aops         []Aop
	parses       []ArgParse
	dress        RetDress
	sessionStore session.SessionStore
}
type deploy struct {
	addr     string
	resource struct {
		index      string
		staticDirs []string
		viewDir    string
		exts       []string
	}
}

type cup struct {
	allocate allocate
	mux      *http.ServeMux
	deploy   deploy
}


type OSInfoType struct {
	GOPATH string
}

type CupInfoType struct {
	Cup struct{
		RootPath string
	}
	Os OSInfoType
}

var CupInfo *CupInfoType

func init() {

	CupInfo = new(CupInfoType)

	osInfo := &OSInfoType{
		GOPATH : os.Getenv("GOPATH"),
	}

	//check env
	_type := reflect.TypeOf(*osInfo)
	_value := reflect.ValueOf(*osInfo)
	for i:=0; i < _type.NumField(); i++{
		if "" == strings.Trim(_value.Field(i).String()," "){
			fmt.Println("sorry, the system variables ["+ _type.Field(i).Name +"] must be set, if you use this framework.")
			os.Exit(-1)
		}
	}

	CupInfo.Os = *osInfo
	//check exist
	CupInfo.Cup.RootPath = osInfo.GOPATH + "/src/web-cup"
	if _, err := os.Stat(CupInfo.Cup.RootPath);os.IsNotExist(err){
		fmt.Println("sorry, the [/src/web-cup] in gopath is not exist please check and try after.")
		os.Exit(-1)
	}

}


func NewCup() *cup {
	newCup := &cup{
		mux: http.NewServeMux(),
		allocate: struct {
			aops         []Aop
			parses       []ArgParse
			dress        RetDress
			sessionStore session.SessionStore
		}{aops: []Aop{&DefaultAop{
			filter: struct {
				passURL     []string
				startTime   time.Time
				endTime     time.Time
				delNanoTime int64
			}{
				[]string{
					"/view/login.html",
					"/view/login",
					"/view/res/img/avatar.jpg",
					"/view/res/img/login/login.jpg",
					"/view/res/img/bakerstreet-club.ico",
				},
				time.Now(),
				time.Now(),
				-1,
			},
		}}, parses: []ArgParse{&Args{}, &ArgsRest{}, &ArgsJson{}, &ArgsXML{}, &CtxParse{}}, dress: &RetsJson{}, sessionStore: &store.DefaultSessionStore{}},
		deploy: struct {
			addr     string
			resource struct {
				index      string;
				staticDirs []string;
				viewDir    string;
				exts       []string
			}
		}{addr: "127.0.0.1:8888", resource: struct {
			index      string
			staticDirs []string
			viewDir    string
			exts       []string
		}{index: "view/biz/login/index.html", staticDirs: []string{
			"assets",
		}, viewDir: "view", exts: []string{
			".html", ".css", ".js", ".md", ".txt",
			".json", ".jpg", ".png", ".gif", ".map",
			".woff2", ".woff", ".ttf", ".ico",
		}}},
	}

	//init put something
	newCup.resourcePour()
	newCup.Filling(&controller.System{})

	return newCup
}

//dynamic
func (this *cup) Run(addr []string) {
	defer func() {
		//final run here
		if exception := recover(); nil != exception {
			fmt.Println("exception => ", exception)
		}
	}()
	if nil == this.mux {
		panic("sorry, the mux init error.")
	}
	if 0 < len(addr) {
		for _, v := range addr {
			go func(v string) {
				fmt.Println("the web cup server is run =>-> : " + v)
				http.ListenAndServe(v, this.mux)
			}(v)
		}
		select{}
	} else {
		fmt.Println("the web cup server is run =>-> : " + this.deploy.addr)
		http.ListenAndServe(this.deploy.addr, this.mux)
	}
}

//standard
func (this *cup) AddAop(aop Aop) *cup {
	this.allocate.aops = append(this.allocate.aops, aop)
	return this
}
func (this *cup) AddParser(parser ArgParse) *cup {
	this.allocate.parses = append(this.allocate.parses, parser)
	return this
}
func (this *cup) SetRetDress(dresser RetDress) *cup {
	this.allocate.dress = dresser
	return this
}
func (this *cup) SetSessionStore(sessionStore session.SessionStore) *cup {
	this.allocate.sessionStore = sessionStore
	return this
}

func (this *cup) findPath(initPath string) string{
	if _, err := os.Stat(initPath); nil == err || os.IsExist(err){
		return initPath
	}
	finalPath := CupInfo.Cup.RootPath + "/"+ initPath
	if _, err := os.Stat(finalPath); nil == err || os.IsExist(err){
		return finalPath
	}
	return initPath
}

func (this *cup) DefaultFace(index string){
	if len(index) <= 0{
		fmt.Println("error: can not set the index show.")
		return
	}
	this.deploy.resource.index = index
}

//biz
func (this *cup) Filling(controller interface{}) *cup {
	//check
	if nil == this.mux {
		this.mux = http.NewServeMux()
	}
	_type := reflect.TypeOf(controller)
	_value := reflect.ValueOf(controller)
	theView, err := NewView(this.deploy.resource.viewDir)
	if nil != err {
		fmt.Println("NewView Error:", err)
	}
	//default session store
	//auto register route with has func
	for i := 0; i < _type.NumMethod(); i++ {
		fnName := _type.Method(i).Name
		//just register public func
		if !('A' <= fnName[0] && fnName[0] <= 'Z') {
			continue
		}
		route := buildPath(fnName)
		method := _value.Method(i)
		methodType := method.Type()
		//handle route
		this.mux.HandleFunc(route, func(res http.ResponseWriter, req *http.Request) {
			//get session first
			context := NewCtx(res, req, session.NewSimpleSession(res, req, this.allocate.sessionStore))
			if nil != this.allocate.aops && 0 < len(this.allocate.aops) {
				//aop do here
				defer func() {
					ok := true
					for _, itemAop := range this.allocate.aops {
						ok = itemAop.After(context) && ok
					}
					if !ok {
						return
					}
				}()
				ok := true
				for _, itemAop := range this.allocate.aops {
					ok = itemAop.After(context) && ok
				}
				if !ok {
					return
				}
			}
			//then do
			//clearURL := path2.Clean(strings.Trim(req.URL.Path, "/"))
			args := []reflect.Value{}
			for i := 0; i < methodType.NumIn(); i++ {
				argType := methodType.In(i)
				for _, parser := range this.allocate.parses {
					if argValue, ok := parser.Parse(&context, argType); ok {
						args = append(args, argValue)
						break
					}
				}
			}
			callReturn := method.Call(args)
			//if have back info
			if 0 < len(callReturn) {
				if 1 < len(callReturn) {
					fmt.Println("the server [" + route + "] is error, the return param must just one for request.")
					res.Write([]byte("sorry, the server [" + route + "] is error"))
					return
				} else {
					route = this.findPath(route)
					if temp, err := theView.GetDefaultTemp(route); nil != err {
						if jsonAfter, err := this.allocate.dress.Sew(callReturn[0].Interface()); nil == err {
							res.Write(jsonAfter)
						}
					} else {
						temp.Execute(res, callReturn[0].Interface())
					}
				}
			} else {
				route = this.findPath(route)
				if reader, err := theView.GetHtml(route); nil == err {
					io.Copy(res, reader)
				}else{
					res.Write([]byte("sorry, the system can not find the temp for you."))
				}
			}
		})
		fmt.Println("Register =>-> " + route)
	}
	return this
}


func (this *cup) resourcePour() {
	this.mux.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		//get session first
		context := NewCtx(res, req, session.NewSimpleSession(res, req, this.allocate.sessionStore))
		if nil != this.allocate.aops && 0 < len(this.allocate.aops) {
			//aop do here
			defer func() {
				ok := true
				for _, itemAop := range this.allocate.aops {
					ok = itemAop.After(context) && ok
				}
				if !ok {
					return
				}
			}()
			ok := true
			for _, itemAop := range this.allocate.aops {
				ok = itemAop.After(context) && ok
			}
			if !ok {
				return
			}
		}
		clearURL := path2.Clean(strings.Trim(req.URL.Path, "/"))
		//if zero server empty
		if 0 == len(clearURL) || strings.HasPrefix(clearURL, ".") {
			http.ServeFile(res, req, this.findPath(this.deploy.resource.index))
			return
		}
		admit := 0
		thePath := ""
		for _, dir := range this.deploy.resource.staticDirs {
			dir = path2.Clean(dir)
			if strings.HasPrefix(clearURL, dir) {
				thePath = clearURL
				admit++
				break
			}
		}
		if 0 == len(thePath) || admit <= 0 {
			io.WriteString(res, "sorry, not allow query this resource ...")
			return
		}

		theExt := path2.Ext(clearURL)
		for _, ext := range this.deploy.resource.exts {
			if theExt == ext {
				admit++
				break
			}
		}
		if admit < 2 {
			io.WriteString(res, "sorry, not allow query this resource ...")
			return
		}

		//server file
		//http.FileServer(http.Dir(this.findPath(theDir)))
		//fmt.Println(this.findPath(theDir))
		http.ServeFile(res, req, this.findPath(thePath))
	})
}

//private adorn
func buildPath(fnName string) string {
	paths := [][]byte{}
	nameSize := len(fnName)
	for pi, i := 0, 0; i < nameSize; i++ {
		if 'A' <= fnName[i] && fnName[i] <= 'Z' {
			paths = append(paths, []byte(fnName[pi:i]))
			pi = i
		}
		//add final if no format
		if nameSize-1 == i {
			paths = append(paths, []byte(fnName[pi:]))
		}
	}
	path := strings.ToLower(string(bytes.Join(paths, []byte{'/'})))
	//no special sign
	//remove _
	path = strings.Replace(path, "_", "", -1)
	return path2.Clean(path)
}
