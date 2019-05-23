/*
 * @Author : leaf.fly
 * @Create : 2019-05-23 13:23
 * @Desc : this is class named ctx for do about context
 * @Version : v1.0.0.20190523
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package cup

import (
	"web-cup/lib/session"
	"net/http"
)

type ctx struct {
	res      http.ResponseWriter
	req     *http.Request
	session session.Session
}

func init() {

}

func NewCtx(res http.ResponseWriter, req *http.Request, session session.Session) ctx{
	return ctx{
		res : res,
		req : req,
		session : session,
	}
}
