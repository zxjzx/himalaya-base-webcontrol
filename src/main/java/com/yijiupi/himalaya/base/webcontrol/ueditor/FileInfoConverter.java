package com.yijiupi.himalaya.base.webcontrol.ueditor;

import com.yijiupi.himalaya.base.webcontrol.entity.FileInfoRO;
import com.yijiupi.himalaya.basic.file.domain.FileInfo;

public class FileInfoConverter {

	
	private FileInfoConverter(){}
	
	public static final FileInfoRO converterRO(FileInfo fileInfo){
		FileInfoRO fileInfoRO = new FileInfoRO();
		fileInfoRO.setUrl(fileInfo.getCloudSrc());
		return fileInfoRO;
	}
	
}
