package com.yijiupi.himalaya.base.webcontrol.pagemodel;

import java.util.List;

/*********************************************
 * ClassName:PagesResult 分页数据返回类
 * @author wangran Date 2016年3月04日
 *********************************************/
public class ListResult<T> extends BaseResult {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private List<T> list;

	public ListResult(List<T> list) {
		this.setList(list);
	}

	public List<T> getList() {
		return list;
	}

	private void setList(List<T> list) {
		this.list = list;
	}
}
