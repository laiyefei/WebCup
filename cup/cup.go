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
	"net/http"
	"reflect"
	"strings"
	"web-cup/lib/session"
)

type allocate struct {
	sessionStore session.SessionStore
}

type deploy struct {
	addr string
}

type cup struct {
	allocate allocate
	mux      *http.ServeMux
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

		})

		fmt.Println("Register =>= " + route)
	}

	return this
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
	path = strings.ReplaceAll(path, "_", "")
	return strings.ReplaceAll(path+"/", "//", "/")
}
