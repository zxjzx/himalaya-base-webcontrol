/*
 * Copyright © 2016 北京易酒批电子商务有限公司. All rights reserved.
 */

package com.yijiupi.himalaya.base.webcontrol.dictionarydropdown.vo;


import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.yijiupi.himalaya.trading.setting.domain.dictionary.Dictionary;
import com.yijiupi.himalaya.trading.setting.domain.dictionary.DictionaryType;

/*********************************************
 * ClassName: Dictionary类型
 *
 * 字典类型
 *
 * @author 王新
 * @since 2016年4月6日
 *
 *********************************************/
public class DictionaryTypeVO implements Serializable {
	private static final long serialVersionUID = 1L;
	private Integer id;
	/**
	 * 字典类型代码
	 */
	private String typeCode;

	/**
	 * 字典类型名称
	 */
	private String typeName;

	/**
	 * 字典明细
	 */
	private List<DictionaryVO> items;

	public DictionaryTypeVO() {

	}

	public DictionaryTypeVO(DictionaryType model) {
		id = model.getId();
		typeCode = model.getTypeCode();
		typeName = model.getTypeName();
		items = null;
		List<Dictionary> item = model.getItems();
		if (item != null) {
			List<DictionaryVO> voItem = new ArrayList<DictionaryVO>();
			for (Dictionary mo : item) {
				DictionaryVO vo = new DictionaryVO(mo);
				voItem.add(vo);
			}
			items = voItem;
		}

	}

	public static List<DictionaryTypeVO> convertToVOList(List<DictionaryType> dataList) {
		List<DictionaryTypeVO> modelVOList = new ArrayList<DictionaryTypeVO>();
		for (DictionaryType model : dataList) {
			DictionaryTypeVO vo = new DictionaryTypeVO(model);
			modelVOList.add(vo);
		}
		return modelVOList;
	}

	public String getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public List<DictionaryVO> getItems() {
		return items;
	}

	public void setItems(List<DictionaryVO> items) {
		this.items = items;
	}

}
