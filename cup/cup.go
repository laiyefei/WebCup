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
	"net/http"
	"web-cup/lib/session"
)

type allocate struct {
	sessionStore session.SessionStore
}

type cup struct {
	allocate allocate
	mux      *http.ServeMux
}

func NewCup() *cup {

}

func (this *cup) Register(controller interface{}) *cup {

}


