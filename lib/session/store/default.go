/*
 * @Author : leaf.fly
 * @Create : 2019-05-25 8:27
 * @Desc : this is class named default.go for do default.go
 * @Version : v1.0.0.20190525
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package store

import (
	"fmt"
	"web-cup/aid"
)

type DefaultSessionStore struct {
	GlobalSign string "$session"
}

func (this *DefaultSessionStore) Gain(sid string, key string) (val interface{}, ok bool) {
	defer func() {
		if expection := recover(); nil != expection {
			fmt.Println("expection => ", expection)
			ok = false
		} else {
			ok = true
		}
	}()
	//get single instance
	global := aid.GetGlobalCacheInstance()
	if nil == global {
		panic("sorry, the global instance is error get.")
	}
	sCache := global.Get(sid)
	if nil == sCache {
		panic("sorry, the session is not exist. ")
	}
	//if get session trans to map
	kv, ok := sCache.(map[string]interface{})
	if !ok {
		panic("sorry, the session type is error.")
	}
	val, ok = kv[this.GlobalSign+key]
	if !ok {
		panic("sorry, the session have not value for this key.")
	}
	return
}
func (this *DefaultSessionStore) GainString(sid string, key string) (string, bool) {
	val, ok := this.Gain(sid, this.GlobalSign+key)
	return val.(string), ok
}
func (this *DefaultSessionStore) Save(sid string, key string, val interface{}) (ok bool) {
	defer func() {
		if expection := recover(); nil != expection {
			fmt.Println("expection => ", expection)
			ok = false
		} else {
			ok = true
		}
	}()
	//get single instance
	global := aid.GetGlobalCacheInstance()
	if nil == global {
		panic("sorry, the global instance is error get. ")
	}
	sCache := global.Get(sid)
	if nil == sCache {
		sCache = map[string]interface{}{
			this.GlobalSign + key: val,
		}
		global.Set(sid, sCache)
		return
	}
	mCache, ok := sCache.(map[string]interface{})
	if !ok {
		panic("sorry, the cache is can not cast to target type. ")
	}
	mCache[this.GlobalSign+key] = val
	global.Set(sid, mCache)
	return
}
func (this *DefaultSessionStore) SaveString(sid string, key string, val string) bool {
	return this.Save(sid, key, val)
}
func (this *DefaultSessionStore) IsExist(sid string, key string) bool {
	_, ok := this.Gain(sid, key)
	return ok
}
func (this *DefaultSessionStore) Clean(sid string, key string) {
	defer func() {
		if expection := recover(); nil != expection {
			fmt.Println("expection => ", expection)
		}
	}()
	//get single instance
	global := aid.GetGlobalCacheInstance()
	if nil == global {
		panic("sorry, the global instance is error get. ")
	}
	sCache := global.Get(sid)
	if nil == sCache {
		panic("sorry, the session is not exist. ")
	}
	//if get session trans to map
	kv, ok := sCache.(map[string]interface{})
	if !ok {
		panic("sorry, the session type is error.")
	}
	delete(kv, this.GlobalSign+key)
}
func (this *DefaultSessionStore) CleanSession(sid string) {
	defer func() {
		if expection := recover(); nil != expection {
			fmt.Println("expection => ", expection)
		}
	}()
	//get single instance
	global := aid.GetGlobalCacheInstance()
	if nil == global {
		panic("sorry, the global instance is error get. ")
	}
	global.Delete(sid)
}
func (this *DefaultSessionStore) CleanAll() {
	defer func() {
		if expection := recover(); nil != expection {
			fmt.Println("expection => ", expection)
		}
	}()
	//get single instance
	global := aid.GetGlobalCacheInstance()
	if nil == global {
		panic("sorry, the global instance is error get.")
	}
	global.DeleteStringKeyByPrefix(this.GlobalSign)
}
