package com.yijiupi.himalaya.base.webcontrol.file;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.dubbo.common.utils.StringUtils;
import com.yijiupi.himalaya.base.dto.UserIdentity;
import com.yijiupi.himalaya.base.search.PageList;
import com.yijiupi.himalaya.base.utils.EnumHelper;
import com.yijiupi.himalaya.base.webcontrol.entity.FileInfoBaseVO;
import com.yijiupi.himalaya.base.webcontrol.file.service.HttpClientBaseService;
import com.yijiupi.himalaya.base.webcontrol.file.service.IFileApiBaseService;
import com.yijiupi.himalaya.base.webcontrol.pagemodel.BaseResult;
import com.yijiupi.himalaya.base.webcontrol.pagemodel.PagesResult;
import com.yijiupi.himalaya.basic.file.domain.FileConfig;
import com.yijiupi.himalaya.basic.file.domain.PicCategory;
import com.yijiupi.himalaya.basic.file.dto.FileInfoDTO;
import com.yijiupi.himalaya.basic.file.utility.FileUpdateHelper;

@RestController
@RequestMapping("/templates/basewebcontrol/upload")
public class FileUploaderBaseController {
	
	@Autowired
	private IFileApiBaseService iFileApiService;
	
	@Autowired
	private HttpClientBaseService httpClientService;
	
	@Value("${webp.api.url}")
	private String converterToWebPurl;
	
	private static final Logger LOG = LoggerFactory.getLogger(FileUploaderBaseController.class);
	
	/**
	 * 保存多个文件信息
	 * @param bussinessId
	 * @param category
	 * @return
	 * @auth wangran
	 * @since 2016年4月19日上午9:22:22 throws
	 */
	@RequestMapping(value = "/common/uploadFiles/{bussinessId}/{category}/{userId}", method = RequestMethod.POST)
	public BaseResult uploadFiles(@PathVariable String bussinessId, @PathVariable("category") String category, @PathVariable("userId") Integer userId, MultipartFile[] files) {
		UserIdentity identity = new UserIdentity();
		identity.setUserId(userId);
		FileConfig fileconfig = iFileApiService.getFileConfig(EnumHelper.getEnumByValue(PicCategory.class, Integer.valueOf(category)));
		List<FileInfoDTO> dtoList = FileUpdateHelper.uploadPicFile(files, bussinessId, fileconfig);
		for (FileInfoDTO dto : dtoList) {
			dto.setIdentity(identity);
			String imageUrl = dto.getCloudSrc();
			converterToWebP(imageUrl);
		}
		PageList<FileInfoBaseVO> voList = iFileApiService.saveFiles(dtoList);
		
		PagesResult<FileInfoBaseVO> result = new PagesResult<>(voList);
		return result;
	}

	private void converterToWebP(String imageUrl){
		if (!StringUtils.isEmpty(imageUrl)) {
			try {
				httpClientService.doGet(converterToWebPurl, imageUrl);
				LOG.info("图片【"+imageUrl+"】格式转换成功");
			} catch (Exception e) {
				LOG.error("图片【"+imageUrl+"】格式转换失败");
			}
		}
	}

	/**
	 * 删除图片信息
	 * @param picId 图片信息id
	 * @return
	 */
	@RequestMapping(value = "/common/deletePic/{picId}", method = RequestMethod.POST)
	public BaseResult deletePic(@PathVariable("picId") Integer picId) {
		iFileApiService.deletePic(picId);
		return BaseResult.getSuccessResult();
	}

}
