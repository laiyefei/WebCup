/*
 * @Author : leaf.fly
 * @Create : 2019-05-25 11:36
 * @Desc : this is class named rets for do rets
 * @Version : v1.0.0.20190525
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package cup

import (
	"encoding/json"
	"encoding/xml"
)

type RetDress interface {
	Sew(interface{}) ([]byte, error)
}

type RetsJson struct {
}

func (this *RetsJson) Sew(input interface{}) ([]byte, error) {
	return json.Marshal(input)
}

type RetsXml struct {
}

func (this *RetsXml) Sew(input interface{}) ([]byte, error) {
	return xml.Marshal(input)
}
