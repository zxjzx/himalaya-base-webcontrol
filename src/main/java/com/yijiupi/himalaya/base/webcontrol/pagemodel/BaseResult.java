/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.base.webcontrol.pagemodel;

import java.io.Serializable;
import java.io.StringWriter;

import com.yijiupi.himalaya.base.webcontrol.consts.WebConstant;

/*********************************************
 * ClassName: BaseResult <br>
 * Description: 返回数据基类<br>
 * @author wangran Date 2016年3月04日
 *********************************************/
public class BaseResult implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -731977350718812483L;

	// region 属性定义
	private String message;

	private String detailMessage;

	/**
	 * TODO 此字段应建议为整型，作为错误码，方便数据比较。
	 */
	private String result;
	// endregion

	// region 构造方法
	public BaseResult() {
	}

	public BaseResult(String result) {
		this.result = result;
	}

	public BaseResult(String message, String result) {
		this.message = message;
		this.result = result;
	}

	public BaseResult(Exception exception) {
		this.result = WebConstant.RESULT_FAILED;
		this.message = getFinalMessage(exception);
		// TODO bjw 此处应设置一个开关，减少在生产环境中的网络流量;或者开发环境、生产环境构建不同的jar包
		StringWriter sw = new StringWriter();
		exception.printStackTrace(new java.io.PrintWriter(sw));
		this.detailMessage = sw.toString();
	}

	public BaseResult(String message, Exception exception) {
		this(exception);
		this.message = message;
	}

	public static BaseResult getSuccessResult() {
		return new BaseResult("success", WebConstant.RESULT_SUCCESS);
	}
	// endregion

	// region get&set方法
	/**
	 * 获取最末层的异常提示信息
	 * @param exception 异常
	 * @return 最末层的异常提示信息
	 */
	private String getFinalMessage(Exception exception) {
		String message = exception.getMessage();
		Throwable cause = exception.getCause();
		// 循环3层获取到异常提示信息
		int i = 0;
		while (null != cause && i < 3) {
			message = cause.getMessage();
			cause = cause.getCause();
			i++;
		}
		return message;
	}

	/**
	 * 获取业务人员查看的信息
	 * @return: String
	 */
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	/**
	 * 获取开发人员查看的信息
	 * @return: String
	 */
	public String getDetailMessage() {
		return detailMessage;
	}

	public void setDetailMessage(String detailMessage) {
		this.detailMessage = detailMessage;
	}

	/**
	 * 获取响应结果
	 * @return: String
	 */
	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}
}
