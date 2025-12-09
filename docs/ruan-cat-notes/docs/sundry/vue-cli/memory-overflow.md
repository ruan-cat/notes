# 内存溢出

## Ineffective mark-compacts near heap limit Allocation failed-JavaScript heap out of memory

- https://blog.csdn.net/xiaoxia188/article/details/107833654

## NODE_OPTIONS=--max-old-space-size

- https://blog.csdn.net/wuyujin1997/article/details/122869951

目前的解决方式是使用 node 提供的选项，而不是另外安装一个依赖包。increase-memory-limit，这个依赖包是侵入式的，他会改动当前项目的全部.bin 命令，而且容易出现命令识别不出来的错误。
