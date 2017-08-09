package com.yijiupi.himalaya.base.webcontrol.entity;

import java.io.Serializable;

public class FileInfoRO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 主键id
	 */
	private Integer id;
	/**
	 * 文件名
	 */
	private String fileName;
	/**
	 * 文件扩展名
	 */
	private String fileExtName;
	/**
	 * 文件大小
	 */
	private Long fileSize;

	/**
	 * 云存储中文件的存储路径
	 */
	private String url;

	/**
	 * 业务id：如果是产品规格，存储的就是产品规格id；如果是广告，就是广告id，以此类推
	 */
	private String bussinessId;

	/**
	 * 业务分类
	 */
	private String bussinessCategory;

	/**
	 * 文件类型:图片(0)
	 */
	private Integer fileType;

	// endregion

	// region 构造方法
	public FileInfoRO() {

	}


	// region get&set方法
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileExtName() {
		return fileExtName;
	}

	public void setFileExtName(String fileExtName) {
		this.fileExtName = fileExtName;
	}

	public Long getFileSize() {
		return fileSize;
	}

	public void setFileSize(Long fileSize) {
		this.fileSize = fileSize;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getBussinessId() {
		return bussinessId;
	}

	public void setBussinessId(String bussinessId) {
		this.bussinessId = bussinessId;
	}

	public String getBussinessCategory() {
		return bussinessCategory;
	}

	public void setBussinessCategory(String bussinessCategory) {
		this.bussinessCategory = bussinessCategory;
	}

	public Integer getFileType() {
		return fileType;
	}

	public void setFileType(Integer fileType) {
		this.fileType = fileType;
	}
	
}
