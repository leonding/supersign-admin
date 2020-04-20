<?php
namespace app\admin\command;

use think\Cache;
use think\console\Command;
use think\console\Input;
use think\console\Output;
use think\console\input\Argument;
use think\console\input\Option;
use think\Log;
use think\Db;

class SecurityCode extends Command
{
    protected function configure()
    {
        $this->setName('securitycode')
        ->setDescription('request appleauth')
        ->addArgument('appleid', Argument::OPTIONAL, "appleid")
        ->addArgument('password', Argument::OPTIONAL, 'password');
    }

    protected function execute(Input $input, Output $output)
    {
        $appleid = trim($input->getArgument('appleid'));
        $password = trim($input->getArgument('password'));

        $descriptorspec = array(
            array("pipe", "r"),  // 标准输入，子进程从此管道中读取数据
            array("pipe", "w"),  // 标准输出，子进程向此管道中写入数据
            array("pipe", "w"),
            array("file", __DIR__ . "/error-output.txt", "a") // 标准错误，写入到一个文件
        );
        
        $process = proc_open('/Users/leon/.rvm/rubies/ruby-2.4.6/bin/ruby static/admin/applelogin.rb '.$appleid.' '.$password, $descriptorspec, $pipes);
        if (is_resource($process)) {
            $writeStream = $pipes[0];
            $readStream = $pipes[1];
            $errorStream = $pipes[2];
            do{
                $redis = new Cache;
                $code = $redis->get("SecurityCode".$appleid);
                if($code){
                    fwrite($writeStream, $code."\n");
                    break;
                }
            }while(true);
            fclose($pipes[0]);
            fclose($pipes[1]);
            fclose($pipes[2]);
            
            sleep(8);

            $exit_status = proc_close($process);
            if ($exit_status == 0){
                //账号验证成功
                Log::record("账号验证成功", 'info');

                // $app_data = ['name'=>'会友锦州棋牌1'];
                // Db::name('AdminApp')->where('bundle_id','com.barz.games.mahjongJinZhou')->update($app_data);
            }
        }
    }
}