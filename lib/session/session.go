/*
 * @Author : leaf.fly
 * @Create : 2019-05-23 13:23
 * @Desc : this is class named session for do about session
 * @Version : v1.0.0.20190523
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package session

import (
	"crypto/sha1"
	"encoding/base64"
	"encoding/binary"
	"net/http"
	"sync"
	"time"
)

type Session interface {
	Id() string
	Get(key string) (interface{}, bool)
	GetString(key string) (string, bool)
	Set(key string, val interface{}) bool
	SetString(key string, val string) bool
	IsExist(key string) bool
	Clean(key string)
	CleanAll()
}

type SessionStore interface {
	Gain(sid string, key string) (interface{}, bool)
	GainString(sid string, key string) (string, bool)
	Save(sid string, key string, val interface{}) bool
	SaveString(sid string, key string, val string) bool
	IsExist(sid string, key string) bool
	Clean(sid string, key string)
	CleanSession(sid string)
	CleanAll()
}

type SimpleSession struct {
	id    string
	res   http.ResponseWriter
	req   *http.Request
	store SessionStore
}

// Options stores configuration for a session or session store.
//
// Fields are a subset of http.Cookie fields.
type Options struct {
	Path   string
	Domain string
	// MaxAge=0 means no 'Max-Age' attribute specified.
	// MaxAge<0 means delete cookie now, equivalently 'Max-Age: 0'.
	// MaxAge>0 means Max-Age attribute present and given in seconds.
	MaxAge   int
	Secure   bool
	HttpOnly bool
}

var defaultOptions = &Options{
	Path:     "/",
	MaxAge:   86400 * 7,
	HttpOnly: true,
}

var (
	SESSION_SIGN     = "WEBCUP_SESSION_ID"
	simpleSessionMux = sync.RWMutex{}
)

func init() {

}

func NewSimpleSession(res http.ResponseWriter, req *http.Request, sessionStore SessionStore) *SimpleSession {
	simpleSession := &SimpleSession{
		res:   res,
		req:   req,
		store: sessionStore,
	}
	//id check
	cookie, err := req.Cookie(SESSION_SIGN)
	if nil == err && nil != cookie {
		simpleSession.id = cookie.Value
	} else {
		simpleSession.id = buildSessionId()
		simpleSession.Flush()
	}
	return simpleSession
}

func (this *SimpleSession) Id() string {
	return this.id
}

func (this *SimpleSession) Get(key string) (interface{}, bool) {
	return this.store.Gain(this.id, key)
}

func (this *SimpleSession) GetString(key string) (string, bool) {
	return this.store.GainString(this.id, key)
}

func (this *SimpleSession) Set(key string, val interface{}) bool {
	return this.store.Save(this.id, key, val)
}

func (this *SimpleSession) SetString(key string, val string) bool {
	return this.store.SaveString(this.id, key, val)
}

func (this *SimpleSession) IsExist(key string) bool {
	return this.store.IsExist(this.id, key)
}

func (this *SimpleSession) Clean(key string){
	this.store.Clean(this.id, key)
}

func (this *SimpleSession) CleanAll(){
	this.store.CleanAll()
}

func (this *SimpleSession) Flush() {
	coki := NewCookie(SESSION_SIGN, this.id)
	http.SetCookie(this.res, coki)
}

func buildSessionId() string {
	simpleSessionMux.Lock()
	defer simpleSessionMux.Unlock()
	now := time.Now().UnixNano()
	b := make([]byte, 8)
	binary.LittleEndian.PutUint64(b, uint64(now))
	hash := sha1.New()
	hash.Write(b)
	return base64.URLEncoding.EncodeToString(hash.Sum(nil))
}

//DIY the option you want
func ReviseOptions(options *Options) {
	defaultOptions = options
}

// NewCookie returns an http.Cookie with the options set. It also sets
// the Expires field calculated based on the MaxAge value, for Internet
// Explorer compatibility.
func NewCookie(name, value string) *http.Cookie {
	options := defaultOptions
	cookie := &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     options.Path,
		Domain:   options.Domain,
		MaxAge:   options.MaxAge,
		Secure:   options.Secure,
		HttpOnly: options.HttpOnly,
	}
	if options.MaxAge > 0 {
		d := time.Duration(options.MaxAge) * time.Second
		cookie.Expires = time.Now().Add(d)
	} else if options.MaxAge < 0 {
		// Set it to the past to expire now.
		cookie.Expires = time.Unix(1, 0)
	}
	return cookie
}
