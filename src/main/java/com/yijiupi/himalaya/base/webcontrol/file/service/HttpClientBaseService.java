/**
 * Copyright © 2017 北京易酒批电子商务有限公司. All rights reserved.
 */
package com.yijiupi.himalaya.base.webcontrol.file.service;

import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.client.utils.HttpClientUtils;
import org.apache.http.conn.ssl.AllowAllHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import org.springframework.util.StreamUtils;

import javax.net.ssl.SSLContext;
import java.io.InputStream;
import java.nio.charset.Charset;

/**
 *
 * @author zhangxiaojuan
 * @date 2018/1/29
 */
@Component
public class HttpClientBaseService {

    private static final Logger LOG = LoggerFactory.getLogger(HttpClientBaseService.class);

    private String executeMethod(HttpUriRequest request, final String charsetName) throws Exception {
        CloseableHttpClient client = null;
        CloseableHttpResponse response = null;
        final StopWatch sw = new StopWatch();
        sw.start();
        try {
            final SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial(null, (chain, authType) -> true)
                    .build();
            final SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext,
                    new AllowAllHostnameVerifier());
            client = HttpClients.custom().setSSLSocketFactory(sslsf).setDefaultRequestConfig(getRequestConfig())
                    .build();
            HttpClientContext context = HttpClientContext.create();
            CredentialsProvider credsProvider = new BasicCredentialsProvider();
            response = client.execute(request, context);
            response.getEntity();
            final InputStream in = response.getEntity().getContent();
            Charset charset;
            if (response.getEntity().getContentEncoding() != null) {
                charset = Charset.forName(response.getEntity().getContentEncoding().getValue());
            } else if (charsetName != null) {
                charset = Charset.forName(charsetName);
            } else {
                charset = Charset.forName("UTF-8");
            }
            return StreamUtils.copyToString(in, charset);
        } catch (Exception e) {
            throw new Exception("服务调用异常", e);
        } finally {
            HttpClientUtils.closeQuietly(response);
            HttpClientUtils.closeQuietly(client);
            sw.stop();
            LOG.info("请求耗时:" + sw.getTotalTimeMillis() + "ms @ " + request.getMethod() + " " + request.getURI());
        }
    }

    public String doGet(String url, final String imageUrl) throws Exception {
        final StringBuilder uriBuilder = new StringBuilder(url);
        uriBuilder.append(imageUrl);
        final HttpGet getMethod = new HttpGet(uriBuilder.toString());
        if (LOG.isInfoEnabled()) {
            LOG.info("GET请求：" + getMethod.getURI());
        }
        final String getResp = executeMethod(getMethod, "UTF-8");
        if (LOG.isInfoEnabled()) {
            LOG.info("响应结果：");
            LOG.info(getResp);
        }
        return getResp;
    }

    /**
     * 相关超时设置
     *
     * @return
     * @return: RequestConfig
     */
    private RequestConfig getRequestConfig() {
        // 数据传输处理时间、从连接池中后去连接的timeout时间、建立连接的timeout时间
        RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(3000).setConnectionRequestTimeout(1000)
                .setConnectTimeout(3000).build();
        return requestConfig;
    }
}
