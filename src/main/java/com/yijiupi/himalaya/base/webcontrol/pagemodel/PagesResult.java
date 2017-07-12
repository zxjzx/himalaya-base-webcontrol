/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.base.webcontrol.pagemodel;

import java.io.Serializable;

import com.yijiupi.himalaya.base.search.PageList;
import com.yijiupi.himalaya.base.webcontrol.consts.WebConstant;

/*********************************************
 * ClassName:PagesResult Description: 分页数据返回类
 * @author wangran Date 2016年3月04日
 *********************************************/
public class PagesResult<T extends Serializable> extends BaseResult {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private PageList<T> datas;

	public PageList<T> getDatas() {
		return datas;
	}

	public void setDatas(PageList<T> datas) {
		this.datas = datas;
	}

	public PagesResult() {
		super();
	}

	public PagesResult(String message, String result) {
		super(message, result);
	}

	public PagesResult(PageList<T> list) {
		super(WebConstant.RESULT_SUCCESS);
		this.setDatas(list);
	}
}
