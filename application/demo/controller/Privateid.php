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

use think\Cache;
use think\Controller;
use think\Db;
use think\File;
use think\Console;

/**
 * 私有账号控制器
 * Class Plugs
 * @package app\demo\controller
 * @author Anyon <zoujingli@qq.com>
 * @date 2017/07/10 18:13
 */
class Privateid extends Controller
{
    /**
     * 私有账号池
     * @return \think\response\View
     */
    public function add()
    {
        return view('add', ['title' => '私有账号池']);
    }

    /**
     * 添加苹果账号
     *
     * @return void
     */
    public function addacut()
    {
        $account = $_POST['username'];
        $pwd = $_POST['password'];

        if(empty($account) || empty($pwd)){
            echo json_encode(['status'=> 0]);
            return;
        }else{
            echo json_encode(['status'=>1,'id'=>$account]);

            $size = ob_get_length();
            header("Content-Length: ".$size);
            header("Connection: close");
            header("HTTP/1.1 200 OK");
            header('Content-Type:application/json; charset=utf-8');
            ob_end_flush();
            if(ob_get_length())
            ob_flush();
            flush();
            if (function_exists("fastcgi_finish_request")) { // yii或yaf默认不会立即输出，加上此句即可（前提是用的fpm）
                fastcgi_finish_request(); // 响应完成, 立即返回到前端,关闭连接
            }
            ignore_user_abort(true);//在关闭连接后，继续运行php脚本
            set_time_limit(0);
            sleep(2);
            // 成功
            // 调用脚本
            $output = Console::call('securitycode', [$account, $pwd]);
        }
    }


    /**
     * 验证码写入Redis
     *
     * @return void
     */
    public function msgcode()
    {
        $key = 'SecurityCode'.$_POST['id'];

        $redis = new Cache;
        $redis->set($key, $_POST['msgcode'], 60);

        return ['status'=>1];
    }


    public function checkaccount()
    {
        $data = Db::name('AdminApp')->where('name','会友锦州棋牌1')->find();
        if ($data){
            return true;
        }
        return false;
    }
}
