/*
 * @Author : leaf.fly
 * @Create : 2019-06-01 15:21
 * @Desc : this is class named api for do api
 * @Version : v1.0.0.20190601
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package controller

import (
	"encoding/json"
	"fmt"
)

type Api struct {
	Code   string      `json:"code"`
	Msg    string      `json:"msg"`
	Ok     bool        `json:"ok"`
	Result interface{} `json:"result"`
}

func (this *Api) GetString() string {
	apiResult, err := json.Marshal(this)
	if nil != err {
		fmt.Println(err)
		return ""
	}
	return string(apiResult)
}
