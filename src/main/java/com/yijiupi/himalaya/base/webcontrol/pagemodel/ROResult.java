/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.base.webcontrol.pagemodel;

import com.yijiupi.himalaya.base.webcontrol.consts.WebConstant;

public class ROResult<T> extends BaseResult {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	T data;

	public ROResult() {
		super();
	}

	public ROResult(T data) {
		super(WebConstant.RESULT_SUCCESS);
		this.setData(data);
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}
}
