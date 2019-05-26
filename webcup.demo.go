/*
 * @Author : leaf.fly
 * @Create : 2019-05-23 13:23
 * @Desc : this is class named webcup.demo.go for do tell you how to use this framework
 * @Version : v1.0.0.20190523
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package main

import (
	"web-cup/DemoController"
	"web-cup/disp"
)

func main() {
	//run this framework here
	disp.NewDis().RegisterController(DemoController.DemoController{}).Run()
}
