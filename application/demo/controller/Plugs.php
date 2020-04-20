<?php

// +----------------------------------------------------------------------
// | ThinkAdmin
// +----------------------------------------------------------------------
// | 版权所有 2014~2017 广州楚才信息科技有限公司 [ http://www.cuci.cc ]
// +----------------------------------------------------------------------
// | 官方网站: http://think.ctolog.com
// +----------------------------------------------------------------------
// | 开源协议 ( https://mit-license.org )
// +----------------------------------------------------------------------
// | github开源项目：https://github.com/zoujingli/ThinkAdmin
// +----------------------------------------------------------------------

namespace app\demo\controller;

use think\Controller;
use think\Db;
use think\File;

/**
 * 系统权限管理控制器
 * Class Plugs
 * @package app\demo\controller
 * @author Anyon <zoujingli@qq.com>
 * @date 2017/07/10 18:13
 */
class Plugs extends Controller
{


    /**
     * 文件上传
     * @return \think\response\View
     */
    public function file()
    {
        return view('', ['title' => '文件上传']);
    }

    /**
     * 总览
     * @return \think\response\View
     */
    public function region()
    {
        return view('', ['title' => '总览']);
    }

    /**
     * 发布应用
     * @return \think\response\View
     */
    public function editor()
    {
        return view('', ['title' => '应用上传']);
    }

    /**
     * 私有账号池
     * @return \think\response\View
     */
    public function private()
    {
        return view('', ['title' => '私有账号池']);
    }

    public function upload()
    {
        if($this->request->isPost()){
            $res['code']=1;
            $res['msg'] = '上传成功！';
            $file = $this->request->file('file');
            $info = $file->move('../public/upload/admin/',false);
            
            if($info){
                $res['name'] = $info->getFilename();
                $res['filepath'] = 'upload/admin/'.$info->getSaveName();

                $zip = new \ZipArchive();
                if ($zip->open('../public/'.$res['filepath']) === TRUE)
                {
                    for($i = 0; $i < $zip->numFiles; $i++)
                    {   
                        if (preg_match("/Payload\/([^\/]*)\/Info\.plist$/i", $zip->getNameIndex($i), $matches)) {
                            break;
                        }
                    }
                    $foldername = str_replace(strrchr($res['name'], "."),"",$res['name']);
                    $zip->extractTo('../public/upload/admin/'.$foldername);//假设解压缩到在当前路径下images文件夹的子文件夹php
                    $zip->close();//关闭处理的zip文件
                }
                // // 获取plist文件内容
                $content = file_get_contents("../public/upload/admin/". $foldername ."/".$matches[0]);

                // // 解析plist成数组
                $ipa = new \CFPropertyList\CFPropertyList();
                $ipa->parse($content);
                $ipaInfo = $ipa->toArray();

                // ipa 解包信息
                $this->ipa_data_bak = json_encode($ipaInfo);
                // 包名
                $this->package_name = $ipaInfo['CFBundleIdentifier'];
                // 应用名
                $this->app_name = $ipaInfo['CFBundleDisplayName'];
                // 项目名
                $this->bundle_name = $ipaInfo['CFBundleName'];
                // 图标
                $this->icon = $ipaInfo['CFBundleIcons']['CFBundlePrimaryIcon']['CFBundleIconFiles'][2];
                // 图标路径
                $this->icon_path = realpath("../public/upload/admin/".$foldername.'/Payload/'.$this->bundle_name.".app/".$this->icon."@2x.png");
                      
                $this->icon_file = new File($this->icon_path);
                $this->icon_file->isTest(true)->move("/Applications/MAMP/htdocs/public/upload/admin/", "icon.png");
                
                $app = Db::name('AdminApp')->where('bundle_id',$this->package_name)->find();
                if($app){
                    $app_data = ['name'=>$this->app_name, 
                    'bundle_id'=>$this->package_name,
                    'icon'=>"https://supertag.dblace.com/supersign/public/static/img/icon/".$this->package_name."/icon.png",
                    'ipa_url'=> '/usr/local/nginx/html/applesign/sourceipa/'.$this->package_name."/".$res['name']
                    ];
                    Db::name('AdminApp')->where('bundle_id',$this->package_name)->update($app_data);
                }else{
                    $app_count = Db::name('AdminApp')->count()+1;
                    $app_data = ['name'=>$this->app_name, 
                                 'bundle_id'=>$this->package_name,
                                 'icon'=>"https://supertag.dblace.com/supersign/public/static/img/icon/".$this->package_name."/icon.png",
                                 'download_url'=>"https://supertag.dblace.com/supersign/public/index.php?gid=".$app_count,
                                 'ipa_url'=> '/usr/local/nginx/html/applesign/sourceipa/'.$this->package_name."/".$res['name']
                                ];
                    Db::name('AdminApp')->insert($app_data);
                }    

            }else{
                $res['code'] = 0;
                $res['msg'] = '上传失败！'.$file->getError();
            }
            return $res;
        }
    }

    public function api(){
        $appinfo = Db::name('AdminApp')->select();
        // $appinfo  = json_decode(json_encode($appinfo), true);
        $total = Db::name('AdminApp')->count();
        $res = ['code'=>0,'msg'=>'','count'=>$total,'data'=>$appinfo];
        return json($res);
    }

    public function private_add(){
        return view('plugs.private.add', ['title' => '私有账号池']);
    }
}
