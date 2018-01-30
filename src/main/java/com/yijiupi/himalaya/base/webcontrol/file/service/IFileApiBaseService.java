/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */

package com.yijiupi.himalaya.base.webcontrol.file.service;

import com.yijiupi.himalaya.base.exception.BaseException;
import com.yijiupi.himalaya.base.search.PageList;
import com.yijiupi.himalaya.base.webcontrol.entity.FileInfoBaseVO;
import com.yijiupi.himalaya.base.webcontrol.entity.FileInfoRO;
import com.yijiupi.himalaya.basic.file.domain.FileConfig;
import com.yijiupi.himalaya.basic.file.domain.PicCategory;
import com.yijiupi.himalaya.basic.file.dto.FileInfoDTO;

import java.util.List;

public interface IFileApiBaseService {

	/**
	 * 
	 * 保存文件信息，不要直接调用该类，请通过FileUploadHelper调用
	 * @param file
	 * @throws BaseException
	 * @auth wangran
	 * @since 2016年4月14日下午3:09:48
	 *
	 *       throws
	 */
    FileInfoRO saveFile(FileInfoDTO file) throws BaseException;

	/**
	 * 
	 * 保存多个文件信息，不要直接调用该类，请通过FileUploadHelper调用
	 * @param fileList
	 * @throws BaseException
	 * @auth wangran
	 * @since 2016年4月14日下午4:08:07
	 *
	 *       throws
	 */
    PageList<FileInfoBaseVO> saveFiles(List<FileInfoDTO> fileList) throws BaseException;

	/**
	 * 
	 * 删除图片信息
	 * @param picId
	 *            图片id 图片id
	 * @throws BaseException
	 * @auth wangran
	 * @since 2016年4月14日下午3:10:03
	 *
	 *       throws
	 */
    void deletePic(Integer picId) throws BaseException;

	/**
	 * 删除文件信息
	 * @param fileId
	 * @throws BaseException
	 */
    void deleteFile(Integer fileId) throws BaseException;

	/**
	 * 
	 * 根据bussinessId和业务分类获取图片列表
	 * @param bussinessId
	 * @return
	 * @throws BaseException
	 * @auth wangran
	 * @since 2016年4月14日下午3:50:09
	 *
	 *       throws
	 */
    PageList<FileInfoBaseVO> findFileInfoList(String bussinessId, String bussinessCategory) throws BaseException;

	/**
	 * 
	 * @Description
	 * @param picId
	 *            图片id
	 * @return
	 * @throws BaseException
	 * @auth wangran
	 * @since 2016年4月14日下午3:52:17
	 *
	 *       throws
	 */
    FileInfoRO getFileInfoByPicId(Integer picId) throws BaseException;

	/**
	 * 根据picId修改BusinessId
	 * 
	 * @param picId
	 * @throws BaseException
	 */
    void updateFileBusinessIdByPicId(Integer picId, String businessId) throws BaseException;

	/**
	 * 上传文件前必须调用,获取上传配置
	 * 
	 * @return
	 */
    FileConfig getFileConfig(PicCategory category);

}
