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
	path2 "path"
	"reflect"
	"strings"
	"web-cup/lib/session"
)

type allocate struct {
	aop Aop
	sessionStore session.SessionStore
}

type deploy struct {
	addr string
	resource struct{
		index string
		dirs []string
		exts []string
	}
}

type cup struct {
	allocate allocate
	mux      *http.ServeMux
	deploy deploy
}

func NewCup() *cup {

}

func (this *cup) Register(controller interface{}) *cup {

	if nil == this.mux {
		this.mux = http.NewServeMux()
	}

	_type := reflect.TypeOf(controller).Elem()
	_value := reflect.ValueOf(controller).Elem()

	//auto register route with has func
	for i := 0; i < _type.NumMethod(); i++ {

		fnName := _type.Method(i).Name
		//just register public func
		if !('A' <= fnName[0] && fnName[0] <= 'Z') {
			continue
		}

		route := buildPath(fnName)

		//handle route
		this.mux.HandleFunc(route, func(res http.ResponseWriter, req *http.Request) {

			//get session first
			context := NewCtx(res,req, session.NewSimpleSession(res, req, this.allocate.sessionStore))
			if nil != this.allocate.aop{
				//aop do here
				defer func() {
					err := this.allocate.aop.After(context)
					if nil != err {
						fmt.Println(err)
						return
					}
				}()
				err := this.allocate.aop.Before(context)
				if nil != err {
					fmt.Println(err)
					return
				}
			}

			//then do
			clearURL := path2.Clean(strings.Trim(req.URL.Path, "/"))

		})

		fmt.Println("Register =>= " + route)
	}

	return this
}


func (this *cup) resourcePour(){
	this.mux.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {

		//get session first
		context := NewCtx(res,req, session.NewSimpleSession(res, req, this.allocate.sessionStore))
		if nil != this.allocate.aop{
			//aop do here
			defer func() {
				err := this.allocate.aop.After(context)
				if nil != err {
					fmt.Println(err)
					return
				}
			}()
			err := this.allocate.aop.Before(context)
			if nil != err {
				fmt.Println(err)
				return
			}
		}

		clearURL := path2.Clean(strings.Trim(req.URL.Path, "/"))

		//if zero server empty
		if 0 == len(clearURL) {
			http.ServeFile(res, req, this.deploy.resource.index)
			return
		}

		admit := 0
		theDir := ""
		for _, dir := range this.deploy.resource.dirs{
			dir = path2.Clean(dir)
			if strings.HasPrefix(clearURL, dir){
				theDir = dir
				admit++
				break
			}
		}
		if 0 == len(theDir) || admit <= 0{
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
		http.ServeFile(res, req, theDir)
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
