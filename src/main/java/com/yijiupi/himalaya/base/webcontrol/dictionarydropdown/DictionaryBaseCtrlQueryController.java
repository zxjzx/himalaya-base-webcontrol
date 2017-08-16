package com.yijiupi.himalaya.base.webcontrol.dictionarydropdown;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yijiupi.himalaya.base.webcontrol.consts.WebConstant;
import com.yijiupi.himalaya.base.webcontrol.dictionarydropdown.vo.DictionaryTypeVO;
import com.yijiupi.himalaya.base.webcontrol.pagemodel.BaseResult;
import com.yijiupi.himalaya.base.webcontrol.pagemodel.ROResult;

/**
 * Description: 字典查询控制器
 * @author zhangxiaojuan
 * @date 2017年7月11日 
 */
@RestController
public class DictionaryBaseCtrlQueryController {
	@Autowired
	private DictionaryBaseCtrlQueryService dictionaryQueryService;
	/**
	 * 根据字典类型编码获取详情
	 */
	@RequestMapping(value = "/templates/basewebcontrol/dictionary/getDictionaryType/{typeCode}", method = RequestMethod.GET)
	public BaseResult getDictionaryType(@PathVariable("typeCode") String typeCode) {
		DictionaryTypeVO vo = dictionaryQueryService.getDictionaryType(typeCode);
		ROResult<DictionaryTypeVO> result = new ROResult<DictionaryTypeVO>();
		result.setData(vo);
		result.setResult(WebConstant.RESULT_SUCCESS);
		return result;
	}
}
