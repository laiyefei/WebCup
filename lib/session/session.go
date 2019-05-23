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

import "net/http"

type Session interface {
	Id() string
	Get(key string, val interface{}) error
	GetString(key string) (string, error)
	Set(key string, val interface{}) error
	SetString(key string, val string) error
	IsExist(key string) bool
	Clean(key string)
	CleanAll()
}

type SessionStore interface {
	Gain(sid string, key string, val interface{}) error
	GainString(sid string, key string) (string, error)
	Save(sid string, key string, val interface{}) error
	SaveString(sid string, key string, val string) error
	IsExist(sid string, key string) bool
	Clean(sid string, key string)
	CleanSession(sid string)
	CleanAll()
}

type SimpleSession struct {
	id    string
	rw    http.ResponseWriter
	req   *http.Request
	store SessionStore
}
