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
	"io"
	"io/ioutil"
	"os"
	"path"
	"regexp"
)

type view struct {
	cache  map[string]*template.Template
	deploy struct {
		dir    string
		delims []string
	}
}

func NewView(viewDir string) (viewCont *view, err error) {
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
		deploy: struct {
			dir    string
			delims []string
		}{dir: viewDir, delims: delimsContent},
	}
	return
}

// Example usage: <include src="include/header.hmtl" />
func (this *view) includeHandle(content string) (result string) {
	result = content
	matches := regexp.MustCompile(`<include src="([^>]*)" />`).FindAllStringSubmatch(result, -1)
	for _, match := range matches {
		includePos := regexp.MustCompile(match[0])
		tagContent, err := this.readViewFile(match[1])
		if nil != err {
			fmt.Println(err)
			continue
		}
		result = includePos.ReplaceAllString(result, tagContent)
	}
	return
}

func (this *view) readViewFile(fileName string) (content string, err error) {
	//check
	if 0 == len(fileName) {
		return
	}
	filePath := path.Clean(path.Join(this.deploy.dir, fileName))
	outBytes, err := ioutil.ReadFile(filePath)
	if nil != err {
		fmt.Println(err)
		return
	}
	content = string(outBytes)
	return
}

func (this *view) GetHtml(justName string) (reader io.Reader, err error) {
	//check
	if 0 == len(justName) {
		return
	}
	//add after ext
	justName += ".html"
	filePath := path.Join(this.deploy.dir, justName)
	reader, err = os.Open(filePath)
	return
}

func (this *view) GetTemp(fullName string) (temp *template.Template, err error) {
	//check first
	if 0 == len(fullName) {
		return
	}
	//then do
	filePath := path.Clean(path.Join(this.deploy.dir, fullName))
	if tempCache, ok := this.cache[filePath]; ok {
		temp = tempCache
		return
	} else {
		tagContent, err := this.readViewFile(filePath)
		if nil != err {
			fmt.Println(err)
			return nil, err
		}
		//handle include
		tagContent = this.includeHandle(tagContent)
		temp, err = template.New(fullName).Delims(this.deploy.delims[0], this.deploy.delims[1]).Parse(tagContent)
		if nil != err {
			fmt.Println(err)
			return
		}
		this.cache[filePath] = temp
		return
	}
}

func (this *view) GetHtmlTemp(justName string) (temp *template.Template, err error) {
	return this.GetTemp(justName + ".html")
}

func (this *view) GetDefaultTemp(justName string) (temp *template.Template, err error) {
	return this.GetHtmlTemp(justName)
}
