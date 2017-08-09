package com.yijiupi.himalaya.base.webcontrol.dictionarydropdown;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yijiupi.himalaya.base.search.PageList;
import com.yijiupi.himalaya.base.webcontrol.consts.WebConstant;
import com.yijiupi.himalaya.base.webcontrol.dictionarydropdown.vo.DictionaryTypeVO;
import com.yijiupi.himalaya.base.webcontrol.dictionarydropdown.vo.DictionaryVO;
import com.yijiupi.himalaya.base.webcontrol.pagemodel.BaseResult;
import com.yijiupi.himalaya.base.webcontrol.pagemodel.PagesResult;

@RestController
public class DictionaryBaseCtrlQueryController {
	@Autowired
	private DictionaryBaseCtrlQueryService dictionaryQueryService;
	/**
	 * 根据typeCode获取字典数据
	 * @param typeCode :包装规格传PackingUnit
	 * @return
	 * @auth wangran
	 * @since 2016年4月16日下午4:05:32 throws
	 */
	@RequestMapping(value = "/templates/basewebcontrol/dictionary/findAllDicListByDicType/{typeCode}", method = RequestMethod.POST)
	public BaseResult findAllDicListByDicType(@PathVariable("typeCode") String typeCode) {
		DictionaryTypeVO vo = dictionaryQueryService.getDictionaryTypeDetailByCode(typeCode);
		PageList<DictionaryVO> pageList = new PageList<DictionaryVO>();
		if (null != vo) {
			List<DictionaryVO> list = vo.getItems();
			pageList.setDataList(list);
		}
		pageList.setPager(null);
		PagesResult<DictionaryVO> result = new PagesResult<DictionaryVO>();
		result.setDatas(pageList);
		result.setResult(WebConstant.RESULT_SUCCESS);
		return result;
	}
}
