/*
 * @Author : leaf.fly
 * @Create : 2019-05-24 23:35
 * @Desc : this is class named view.go for do view.go
 * @Version : v1.0.0.20190524
 * @Github : http://github.com/laiyefei
 * @Blog : http://laiyefei.com
 * @OtherWebSite : http://bakerstreet.club;http://sherlock.help;
 */
package cup

import (
	"fmt"
	"github.com/pkg/errors"
	"html/template"
	"os"
)

type view struct {
	cache  map[string]*template.Template
	deploy struct {
		dir    string
		delims []string
	}
}

func (this *view) NewView(viewDir string) (viewCont *view, err error) {
	//check
	dir, err := os.Stat(viewDir)
	if nil != err {
		fmt.Println(err)
		return
	}
	if !dir.IsDir() {
		err = errors.New(viewDir + " is not a dir. ")
	}

	//init
	cache := map[string]*template.Template{}
	delimsContent := []string{"([(", ")])"}

	//构造
	viewCont = &view{
		cache: cache,
	}
	viewCont.deploy.dir = viewDir
	viewCont.deploy.delims = delimsContent
	return
}

// Example usage: <include src="include/header.hmtl" />

