/*
 * ʹ�÷���
 * cscript.exe //E:jscript download.js http://nodejs.org/dist/v0.6.5/node.exe node.exe
 */
void function(){
	
	/**
	 * @author ������(wangjihu,http://weibo.com/zswang)
	 * @fileoverview �򵥶ϵ������ı��ؽű�
	 * @version 1.0.0
	 * @date 2012.1.30
	 */
	var console = {
		log: function(info){
			WScript.StdOut.WriteLine(info);
		}
	};
	/*
	 * ��ȡ�����ļ���С
	 */
	function getContentLength(url){
		console.log(['HEAD ', url, " => ", " wait..."].join(''));
		var xmlhttp = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		xmlhttp.open("HEAD", url, false);
		xmlhttp.setRequestHeader("Referer", url); 
		xmlhttp.send();
		var result = -1;
		xmlhttp.GetAllResponseHeaders().replace(/\bContent-Length:\s*(\d+)/, function(all, length){
			result = +length;
		});
		console.log(['Content-Length: ', result].join(''));
		return result;
	}
	
	/*
	 * �ļ��Ƿ����
	 */
	function fileExists(filename){
		if (!filename) return;
		var fso = new ActiveXObject('Scripting.FileSystemObject');
		try {
			return fso.FileExists(filename);
		} catch (ex) {
			console.log(ex.message);
		} finally {
			fso = null;
		}
	}
	/*
	 * �����ļ���С
	 */
	function fileSize(filename){
		if (!filename) return;
		var fso = new ActiveXObject('Scripting.FileSystemObject');
		try {
			return fso.GetFile(filename).size;
		} catch (ex) {
			console.log(ex.message);
			return -1;
		} finally {
			fso = null;
		}
	}
	/*
	 * ����ָ����С������
	 */
	function download(url, filename, range){
		var xmlhttp = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		xmlhttp.open("GET", url, false);
		xmlhttp.setRequestHeader("Referer", url); 
		xmlhttp.setRequestHeader("RANGE", 'bytes=' + range.join('-')); 
		xmlhttp.send();
		var adodbStream = new ActiveXObject("ADODB.Stream");
		adodbStream.Type = 1;
		adodbStream.Open();
		if (fileExists(filename)){
			adodbStream.LoadFromFile(filename);
			adodbStream.position = adodbStream.size;
		}
		adodbStream.Write(xmlhttp.responseBody);
		adodbStream.SaveToFile(filename, 2); 
		adodbStream.Close(); 
		adodbStream = null;
	}
	
	var pageSize = 1024 * 1024; // ÿ������1M
	/*
	 * ��ʼ����
	 */
	function process(url, filename){
		var size = Math.max(fileSize(filename), 0);
		var length = getContentLength(url);
		if (size > 0 && size == length){
			console.log('download complete.');
			return;
		}
		while(size < length){
			console.log(['download progress: ', size, '/', length, ' byte'].join(''));
			download(url, filename, [size, Math.min(size + pageSize, length)]);
			size += pageSize;
		}
		console.log('download complete.');
	}
	if (WScript.Arguments.Length < 2){
		console.log('params: <url>, <filename>');
		return;
	}
	process(WScript.Arguments(0), WScript.Arguments(1));
}();