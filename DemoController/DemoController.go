package DemoController

import (
	"web-cup/cup"
)

type DemoController struct {

	
}

type ArgsParam struct {
	Name string
}

func (this *DemoController) Helloworld(param ArgsParam) string {
	return "Hello World, " + param.Name
}

func (this *DemoController) Helloworldctx(ctx cup.Ctx) string {
	return "Hello World, " + ctx.Req.URL.Query().Get("name")
}

