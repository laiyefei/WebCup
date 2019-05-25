/*
 * @Author : leaf.fly
 * @Create : 2019-05-23 13:23
 * @Desc : this is class named GlobalCached for do save global cached you want
 * @Version : v1.0.0.20190523
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package aid

import (
	"strings"
	"sync"
)

type globalCached struct {
	mu    sync.Mutex
	cache map[interface{}]interface{}
}

var instance *globalCached
var once sync.Once

func GetGlobalCacheInstance() *globalCached {
	if nil != instance {
		return instance
	}
	once.Do(func() {
		instance = &globalCached{}
	})
	return instance
}

func (this *globalCached) Get(key interface{}) interface{} {
	defer this.mu.Unlock()
	this.mu.Lock()
	if nil == this.cache {
		this.cache = make(map[interface{}]interface{})
	}
	return this.cache[key]
}

func (this *globalCached) Set(key, val interface{}) {
	if nil == this.cache {
		return
	}
	defer this.mu.Unlock()
	this.mu.Lock()
	this.cache[key] = val
}

func (this *globalCached) Delete(key interface{}) {
	if nil == this.cache {
		return
	}
	defer this.mu.Unlock()
	this.mu.Lock()
	delete(this.cache, key)
}

func (this *globalCached) DeleteStringKeyByPrefix(key string) {
	if nil == this.cache {
		return
	}
	defer this.mu.Unlock()
	this.mu.Lock()
	for k, _ := range this.cache {
		ckey, cok := k.(string)
		if !cok || !strings.HasPrefix(ckey, key) {
			continue
		}
		delete(this.cache, k)
	}
}

func (this *globalCached) IsExist(key interface{}) bool {
	if nil == this.cache {
		return false
	}
	defer this.mu.Unlock()
	this.mu.Lock()
	for k, _ := range this.cache {
		if key == k {
			return true
		}
	}
	return false
}

func (this *globalCached) Release() {
	if nil == this.cache {
		return
	}
	defer this.mu.Unlock()
	this.mu.Lock()
	this.cache = nil
}
