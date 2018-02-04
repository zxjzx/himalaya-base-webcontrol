/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */

package com.yijiupi.himalaya.base.webcontrol.file.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.alibaba.dubbo.config.annotation.Reference;
import com.yijiupi.himalaya.base.exception.BaseException;
import com.yijiupi.himalaya.base.search.PageList;
import com.yijiupi.himalaya.base.webcontrol.entity.FileInfoBaseVO;
import com.yijiupi.himalaya.base.webcontrol.entity.FileInfoRO;
import com.yijiupi.himalaya.base.webcontrol.file.service.IFileApiBaseService;
import com.yijiupi.himalaya.base.webcontrol.ueditor.FileInfoConverter;
import com.yijiupi.himalaya.basic.file.domain.FileConfig;
import com.yijiupi.himalaya.basic.file.domain.FileInfo;
import com.yijiupi.himalaya.basic.file.domain.PicCategory;
import com.yijiupi.himalaya.basic.file.dto.FileInfoDTO;
import com.yijiupi.himalaya.basic.file.service.IFileService;

@Service
public class FileApiBaseServiceImpl implements IFileApiBaseService {

	@Reference
	private IFileService iFileService;

	@Override
	public FileInfoRO saveFile(FileInfoDTO file) throws BaseException {
		FileInfo fileInfoModel = iFileService.saveFile(file);
		FileInfoRO ro = FileInfoConverter.converterRO(fileInfoModel);
		return ro;
	}

	@Override
	public PageList<FileInfoBaseVO> saveFiles(List<FileInfoDTO> fileList) throws BaseException {
		List<FileInfo> fileInfoModelList = iFileService.saveFiles(fileList);
		PageList<FileInfoBaseVO> voPageList = new PageList<>();
		voPageList.setDataList(FileInfoBaseVO.converToVOList(fileInfoModelList));
		voPageList.setPager(null);
		return voPageList;
	}

	@SuppressWarnings("deprecation")
	@Override
	public void deletePic(Integer picId) throws BaseException {
		iFileService.deletePic(picId);
	}

	@SuppressWarnings("deprecation")
	@Override
	public void deleteFile(Integer fileId) throws BaseException {
		iFileService.deleteFile(fileId);
	}

	@Override
	public PageList<FileInfoBaseVO> findFileInfoList(String bussinessId, String bussinessCategory) throws BaseException {
		List<FileInfo> fileInfoModelList = iFileService.findFileInfoList(bussinessId, bussinessCategory);
		PageList<FileInfoBaseVO> voPageList = new PageList<>();
		voPageList.setDataList(FileInfoBaseVO.converToVOList(fileInfoModelList));
		voPageList.setPager(null);
		return voPageList;
	}

	@SuppressWarnings("deprecation")
	@Override
	public FileInfoRO getFileInfoByPicId(Integer picId) throws BaseException {
		FileInfo fileInfoModel = iFileService.getFileInfoByPicId(picId);
		FileInfoRO ro = FileInfoConverter.converterRO(fileInfoModel);
		return ro;
	}

	@Override
	public void updateFileBusinessIdByPicId(Integer picId, String businessId) throws BaseException {
		iFileService.updateFileBusinessIdByPicId(picId, businessId);
	}

	@Override
	public FileConfig getFileConfig(PicCategory category) {
		return iFileService.getFileConfig(category);
	}

}
