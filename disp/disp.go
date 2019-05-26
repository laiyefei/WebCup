/*
 * @Author : leaf.fly
 * @Create : 2019-05-23 13:23
 * @Desc : this is class named disp for do disp logic
 * @Version : v1.0.0.20190523
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package disp

import "web-cup/cup"

type dis struct {
	controllers []Controller
}


//controller
type Controller interface {

}

var theCup = cup.NewCup()
func NewDis() *dis {
	return &dis{}
}

func (this *dis)Run(addr ...string){
	theCup.Run(addr)
	return
}

func (this *dis) RegisterController(controller Controller) *dis {
	theCup.Filling(controller)
	this.controllers = append(this.controllers, controller)
	return this
}
