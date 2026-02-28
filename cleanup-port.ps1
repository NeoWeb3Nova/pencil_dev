#!/usr/bin/env pwsh
# 清理占用指定端口的进程
# 用法：.\cleanup-port.ps1 [端口号]
# 示例：.\cleanup-port.ps1 8081
# 注意： Windows PowerShell 默认禁止运行脚本，如果执行时报错，需要先执行一次：
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# 然后就可以运行 cleanup-port.ps1 了。

param(
    [Parameter(Position=0)]
    [int]$Port = 8081
)

Write-Host "正在查找占用端口 $Port 的进程..." -ForegroundColor Cyan

try {
    # 获取占用端口的进程 ID
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue

    if ($connection) {
        $pid = $connection.OwningProcess
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue

        if ($process) {
            Write-Host "找到进程: $($process.ProcessName) (PID: $pid)" -ForegroundColor Yellow

            # 强制结束进程
            Stop-Process -Id $pid -Force
            Write-Host "已强制结束进程 $pid" -ForegroundColor Green
        } else {
            Write-Host "未找到进程信息 (PID: $pid)" -ForegroundColor Gray
        }
    } else {
        Write-Host "端口 $Port 未被占用" -ForegroundColor Green
    }
} catch {
    Write-Host "错误：$($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
