/*
 * @Author : leaf.fly
 * @Create : 2019-06-01 14:56
 * @Desc : this is class named system for do system
 * @Version : v1.0.0.20190601
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package controller

type System struct {
}

type ArgsParseParam struct {
	Account  string
	PassWord string
}

func (this *System) BizLoginIndex(param ArgsParseParam) {


}

func (this *System) SystemGetapisign(param ArgsParseParam) interface{} {
	return Api{
		Code:   "wc-001",
		Msg:    "获取接口交互标记成功",
		Ok:     true,
		Result: "⊕",
	}
}
