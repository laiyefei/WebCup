package cup

import "reflect"

type ArgParse interface {
	Parse(env *ctx, typ reflect.Type) (reflect.Value, bool)
}

