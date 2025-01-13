# 替换斜杠
# dirname 表示文件的上一级目录
echo $(dirname "$(echo "$0" | sed -e 's,\\,/,g')")
echo $(dirname $(cd "$(dirname "$0")";pwd))
# // #!/bin/sh
# // basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

# // # 根目录
# // export ROOT_DIR=$(dirname $(dirname $(cd "$(dirname "$0")";pwd)))

# // case `uname` in
# //     *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
# // esac


# // exec node "$basedir/$1" "$@"