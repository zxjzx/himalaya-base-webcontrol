package com.yijiupi.himalaya.base.webcontrol.dictionarydropdown;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.dubbo.config.annotation.Service;
import com.yijiupi.himalaya.base.webcontrol.dictionarydropdown.vo.DictionaryTypeVO;
import com.yijiupi.himalaya.trading.setting.domain.dictionary.DictionaryType;
import com.yijiupi.himalaya.trading.setting.service.IDictionaryTypeService;

@Service
public class DictionaryBaseCtrlQueryService {

	@Reference
	private IDictionaryTypeService dictionaryTypeService;

	public DictionaryTypeVO getDictionaryTypeDetailByCode(String typeCode) {
		DictionaryType model = dictionaryTypeService.getDictionaryTypeDetailByCode(typeCode);
		if (model == null) {
			return null;
		}
		DictionaryTypeVO vo = new DictionaryTypeVO(model);
		return vo;
	}
}
