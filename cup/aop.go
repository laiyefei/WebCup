/*
 * @Author : leaf.fly
 * @Create : 2019-05-23 13:23
 * @Desc : this is class named Aop for do Aop
 * @Version : v1.0.0.20190523
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package cup

import (
	"fmt"
	"time"
)

type Boost interface {
}

type Aop interface {
	//do before context logic run
	Before(ctx Ctx) bool
	//do after context logic run
	After(ctx Ctx) bool
}

type DefaultAop struct {
	filter struct {
		passURL     []string
		startTime   time.Time
		endTime     time.Time
		delNanoTime int64
	}
}

func (this *DefaultAop) Before(context Ctx) (ok bool) {
	defer func() {
		this.filter.endTime = time.Now()
		this.filter.delNanoTime = this.filter.endTime.UnixNano() - this.filter.startTime.UnixNano()
		if exception := recover(); nil != exception {
			fmt.Println(exception)
			ok = false
		} else {
			ok = true
		}
	}()
	this.filter.startTime = time.Now()

	//todo..

	return
}

func (this *DefaultAop) After(context Ctx) (ok bool) {
	defer func() {
		this.filter.endTime = time.Now()
		this.filter.delNanoTime = this.filter.endTime.UnixNano() - this.filter.startTime.UnixNano()
		if exception := recover(); nil != exception {
			fmt.Println(exception)
			ok = false
		} else {
			ok = true
		}
	}()
	//todo..

	return
}
