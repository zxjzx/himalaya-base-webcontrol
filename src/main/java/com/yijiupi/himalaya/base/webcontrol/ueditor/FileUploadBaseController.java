/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */

package com.yijiupi.himalaya.base.webcontrol.ueditor;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.dubbo.config.annotation.Reference;
import com.yijiupi.himalaya.base.webcontrol.entity.FileInfoRO;
import com.yijiupi.himalaya.base.webcontrol.pagemodel.BaseResult;
import com.yijiupi.himalaya.base.webcontrol.pagemodel.ROResult;
import com.yijiupi.himalaya.basic.file.domain.FileConfig;
import com.yijiupi.himalaya.basic.file.domain.PicCategory;
import com.yijiupi.himalaya.basic.file.dto.FileInfoDTO;
import com.yijiupi.himalaya.basic.file.service.IFileService;
import com.yijiupi.himalaya.basic.file.utility.FileUpdateHelper;


@RestController
@RequestMapping("/templates/basewebcontrol/ueditor")
public class FileUploadBaseController {
	
	@Reference
	private IFileService iFileService;
	
	/**
	 * 保存单个文件
	 * @param bussinessId
	 * @param category ：<br>
	 *            产品图片 Product(0)；<br>
	 *            广告图片 Banner(1)；<br>
	 *            促销活动图片 Promotion(2);<br>
	 *            身份证图片 IdentityCard(3)
	 * @param httpRequest
	 * @param response
	 * @return
	 * @auth wangran
	 * @since 2016年4月19日上午9:22:30 throws
	 */
	@RequestMapping(value = "/common/uploadFile")
	public BaseResult uploadFile(@RequestParam(value="action",required = false) String action,@RequestParam(value="noCache",required = false) String noCache, MultipartFile image) {
		if(image == null){
			return new ROResult<FileInfoRO>(new FileInfoRO());
		}
		if("uploadVideoFiles".equals(action)){
			// TODO 换接口 FIXME 周鑫
			FileConfig fileConfig = iFileService.getFileConfig(PicCategory.Banner);
			FileInfoDTO fileInfoDTO = FileUpdateHelper.uploadPicFile(image, "1", fileConfig);
		    com.yijiupi.himalaya.basic.file.domain.FileInfo fileInfoModel = iFileService.saveFile(fileInfoDTO);
		    FileInfoRO ro = FileInfoConverter.converterRO(fileInfoModel);
		    ROResult<FileInfoRO> result = new ROResult<FileInfoRO>(ro);
			return result;
			
		}else{
			FileConfig fileConfig = iFileService.getFileConfig(PicCategory.Banner);
			FileInfoDTO fileInfoDTO = FileUpdateHelper.uploadPicFile(image, "1", fileConfig);
		    com.yijiupi.himalaya.basic.file.domain.FileInfo fileInfoModel = iFileService.saveFile(fileInfoDTO);
		    FileInfoRO ro = FileInfoConverter.converterRO(fileInfoModel);
		    ROResult<FileInfoRO> result = new ROResult<FileInfoRO>(ro);
			return result;
		}
	
	}

	/**
	 * 保存多个文件信息
	 * @param bussinessId
	 * @param category
	 * @param response
	 * @return
	 * @auth wangran
	 * @since 2016年4月19日上午9:22:22 throws
	 */
	@RequestMapping(value = "/common/uploadFiles", method = RequestMethod.POST)
	public String uploadFiles( MultipartFile[] multipartFiles) {
		return "success";
	}
}
