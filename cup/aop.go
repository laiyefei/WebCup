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

type Boost interface {
}

type Aop interface {
	//do before context logic run
	Before(ctx ctx) bool
	//do after context logic run
	After(ctx ctx) bool
}

type DefaultAop struct {
}

func (this *DefaultAop) Before(context ctx) bool {

}

func (this *DefaultAop) After(context ctx) bool {
	
}
