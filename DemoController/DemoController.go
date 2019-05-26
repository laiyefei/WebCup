package DemoController

type DemoController struct {

}

func (this *DemoController) HelloWorld(name string) string {
	return "Hello World, " + name
}