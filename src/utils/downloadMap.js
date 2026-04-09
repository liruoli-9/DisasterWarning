export const downloadMap = (map) => {
   //1.downloadMap 函数首先监听地图的 postcompose 事件，这个事件在地图渲染完成后触发。
            map.once('postcompose', function (event) {
                //1)当 postcompose 事件触发时，它获取渲染上下文的 canvas 元素。
                const canvas = event.context.canvas
                console.log(canvas)
                //2)使用 canvas.toBlob 方法将 canvas 转换为 Blob 对象（二进制对象），然后在转换完成后，使用 saveAs 函数（通常由 FileSaver.js 提供）将 Blob 对象保存为名为 map.png 的图片文件。
                canvas.toBlob(function (blob) {
                    console.log(blob)
                    saveAs(blob, 'map.png')
                })
            })
            map.renderSync()
        }
