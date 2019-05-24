/*
 * @Author : leaf.fly
 * @Create : 2019-05-24 8:23
 * @Desc : this is class named args.go for do args.go
 * @Version : v1.0.0.20190524
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package cup

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"reflect"
	"strconv"
	"strings"
)

type ArgParse interface {
	Parse(env *ctx, p reflect.Type) (reflect.Value, bool)
}

//default parser
type CtxParse struct {
}

func (this *CtxParse) Parse(ctx *ctx, p reflect.Type) (v reflect.Value, success bool) {
	if p != reflect.TypeOf(ctx).Elem() {
		return
	}
	v = reflect.ValueOf(*ctx)
	success = true
	return
}

//parse json from body
type ArgsJson struct {
}

func (this *ArgsJson) Parse(ctx *ctx, p reflect.Type) (v reflect.Value, success bool) {

	success = strings.HasSuffix(p.Name(), reflect.ValueOf(this).Type().Name())
	if !success {
		return
	}
	theNewV := reflect.New(p)
	decoder := json.NewDecoder(ctx.req.Body)
	if err := decoder.Decode(theNewV.Interface()); nil != err {
		v = reflect.ValueOf(theNewV.Interface()).Elem()
		fmt.Println(err)
		return
	}
	v = reflect.ValueOf(theNewV.Interface()).Elem()
	return
}

type ArgsXML struct {
}

func (this *ArgsXML) Parse(ctx *ctx, p reflect.Type) (v reflect.Value, success bool) {

	success = strings.HasSuffix(p.Name(), reflect.ValueOf(this).Type().Name())
	if !success {
		return
	}
	theNewV := reflect.New(p)
	decoder := xml.NewDecoder(ctx.req.Body)
	if err := decoder.Decode(theNewV.Interface()); nil != err {
		v = reflect.ValueOf(theNewV.Interface()).Elem()
		fmt.Println(err)
		return
	}
	v = reflect.ValueOf(theNewV.Interface()).Elem()
	return
}

type ArgsRest struct {
}

func (this *ArgsRest) parseQuery(url string) (data map[string]string) {
	data = make(map[string]string)
	strs := strings.Split(url, "/")
	for i := 0; i+1 < len(strs); i++ {
		data[strings.ToLower(strs[i])] = strs[i+1]
	}
	return
}

func (this *ArgsRest) parse(ctx *ctx, p reflect.Type) (v reflect.Value, success bool) {

	success = strings.HasSuffix(p.Name(), reflect.ValueOf(this).Type().Name())
	if !success {
		return
	}
	req := ctx.req

	theNewValue := reflect.New(p).Elem()
	urlQuery := this.parseQuery(req.URL.Path)
	post := func(key string) string {
		req.ParseForm()
		return req.FormValue(key)
	}
	fun := func(key string) string {
		if urlQueryItem, ok := urlQuery[key]; ok {
			return urlQueryItem
		}
		return post(key)
	}
	for i := 0; i < p.NumField(); i++ {
		qKey := p.Field(i).Name
		qValue := fun(qKey)
		typeName := p.Field(i).Type.Name()
		switch typeName {
		case "string":
			theNewValue.Field(i).SetString(qValue)
		case "int":
			if iv, err := strconv.Atoi(qValue); nil == err {
				theNewValue.Field(i).SetInt(int64(iv))
			}
		case "int64":
			if iv, err := strconv.ParseInt(qValue, 10, 64); nil == err {
				theNewValue.Field(i).SetInt(int64(iv))
			}
		case "bool":
			if bv, err := strconv.ParseBool(qValue); nil == err {
				theNewValue.Field(i).SetBool(bv)
			}
		case "float64":
			if fv, err := strconv.ParseFloat(qValue, 64); nil == err {
				theNewValue.Field(i).SetFloat(fv)
			}
		}
	}
	return
}

type Args struct {
}

func (this *Args) parse(ctx *ctx, p reflect.Type) (v reflect.Value, success bool) {

	success = strings.HasSuffix(p.Name(), reflect.ValueOf(this).Type().Name())
	if !success {
		return
	}
	theNewValue := reflect.New(p).Elem()
	req := ctx.req
	get := func(key string) string {
		return req.URL.Query().Get(key)
	}
	post := func(key string) string {
		return req.FormValue(key)
	}
	fun := (func() func(string) string {
		if "post" == strings.ToLower(req.Method) {
			req.ParseForm()
			return post
		}
		return get
	})()
	for i := 0; i < p.NumField(); i++ {
		qKey := p.Field(i).Name
		qValue := fun(qKey)
		typeName := p.Field(i).Type.Name()
		switch typeName {
		case "string":
			theNewValue.Field(i).SetString(qValue)
		case "int":
			if iv, err := strconv.Atoi(qValue); nil == err {
				theNewValue.Field(i).SetInt(int64(iv))
			}
		case "int64":
			if iv, err := strconv.ParseInt(qValue, 10, 64); nil == err {
				theNewValue.Field(i).SetInt(int64(iv))
			}
		case "bool":
			if bv, err := strconv.ParseBool(qValue); nil == err {
				theNewValue.Field(i).SetBool(bv)
			}
		case "float64":
			if fv, err := strconv.ParseFloat(qValue, 64); nil == err {
				theNewValue.Field(i).SetFloat(fv)
			}
		}
	}
	return
}
