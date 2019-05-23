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
	"sync"
)

type globalCached struct {
	mu    sync.Mutex
	cache map[interface{}]interface{}
}

var instance *globalCached
var once sync.Once

func GetInstance() *globalCached {
	if nil != instance {
		return instance
	}
	once.Do(func() {
		instance = &globalCached{}
	})
	return instance
}

func (this *globalCached) Get(key interface{}) interface{} {
	this.mu.Lock()
	defer this.mu.Unlock()
	if nil == this.cache {
		this.cache = make(map[interface{}]interface{})
	}
	return this.cache[key]
}

func (this *globalCached) Set(key, val interface{}) {
	if nil == this.cache {
		return
	}
	this.mu.Lock()
	defer this.mu.Unlock()
	this.cache[key] = val
}

func (this *globalCached) Delete(key interface{}) {
	if nil == this.cache {
		return
	}
	this.mu.Lock()
	defer this.mu.Lock()
	delete(this.cache, key)
}

func (this *globalCached) IsExist(key interface{}) bool {
	if nil == this.cache {
		return false
	}
	this.mu.Lock()
	defer this.mu.Unlock()
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
	this.mu.Lock()
	defer this.mu.Unlock()
	this.cache = nil
}
