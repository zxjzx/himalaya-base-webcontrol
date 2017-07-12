/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */

package com.yijiupi.himalaya.base.webcontrol.dictionarydropdown.vo;

import java.io.Serializable;

import com.yijiupi.himalaya.trading.setting.domain.dictionary.Dictionary;

/*********************************************
 * ClassName: Dictionary
 *
 * 字典
 *
 * @author 王新
 * @since 2016年4月6日
 *
 *********************************************/
public class DictionaryVO implements Serializable {

	private static final long serialVersionUID = 1L;
	/**
	 * 字典代码
	 */
	private String code;

	/**
	 * 字典名称
	 */
	private String name;

	/**
	 * 排序号
	 */
	private Integer sequence;

	public DictionaryVO() {

	}

	public DictionaryVO(Dictionary mo) {
		code = mo.getCode();
		name = mo.getName();
		sequence = mo.getSequence();
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getSequence() {
		return sequence;
	}

	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}


}
