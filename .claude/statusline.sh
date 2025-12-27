#!/bin/bash

input=$(cat)

# ---- 颜色定义 ----
use_color=1
[ -n "$NO_COLOR" ] && use_color=0

# 颜色代码
C_DIR='\033[38;5;117m'      # 目录 - 天蓝色
C_GIT='\033[38;5;150m'      # Git - 柔和绿
C_MODEL='\033[38;5;147m'    # 模型 - 浅紫色
C_VERSION='\033[38;5;249m'  # 版本 - 浅灰色
C_CTX_GREEN='\033[38;5;158m'  # 上下文充足 - 绿色
C_CTX_YELLOW='\033[38;5;215m' # 上下文中等 - 黄色
C_CTX_RED='\033[38;5;203m'    # 上下文不足 - 红色
C_RESET='\033[0m'

# ---- 检查 jq 是否可用 ----
HAS_JQ=0
command -v jq >/dev/null 2>&1 && HAS_JQ=1

# ---- 提取基本信息 ----
if [ "$HAS_JQ" -eq 1 ]; then
  current_dir=$(echo "$input" | jq -r '.workspace.current_dir // .cwd // "unknown"' 2>/dev/null)
  model_name=$(echo "$input" | jq -r '.model.display_name // "Claude"' 2>/dev/null)
  cc_version=$(echo "$input" | jq -r '.version // ""' 2>/dev/null)
else
  current_dir="unknown"
  model_name="Claude"
  cc_version=""
fi

# 简化路径显示（将用户主目录替换为~）
current_dir=$(echo "$current_dir" | sed "s|^$HOME|~|g")

# ---- Git 分支 ----
git_branch=""
if git rev-parse --git-dir >/dev/null 2>&1; then
  git_branch=$(git branch --show-current 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
fi

# ---- 计算上下文窗口使用情况 ----
context_info=""
context_color="$C_CTX_GREEN"

if [ "$HAS_JQ" -eq 1 ]; then
  # 从 JSON 输入中获取上下文窗口信息
  window_size=$(echo "$input" | jq -r '.context_window.context_window_size // 0' 2>/dev/null)
  current_usage=$(echo "$input" | jq '.context_window.current_usage' 2>/dev/null)

  # 检查是否有当前使用情况数据
  if [ "$current_usage" != "null" ] && [ -n "$current_usage" ]; then
    # 计算总输入token数（包括缓存相关的token）
    input_tokens=$(echo "$current_usage" | jq '(.input_tokens // 0) + (.cache_creation_input_tokens // 0) + (.cache_read_input_tokens // 0)' 2>/dev/null)

    # 验证数据有效性
    if [ -n "$window_size" ] && [ "$window_size" -gt 0 ] && [ -n "$input_tokens" ] && [ "$input_tokens" -ge 0 ]; then
      # 计算使用百分比
      used_pct=$((input_tokens * 100 / window_size))

      # 计算剩余百分比
      remaining_pct=$((100 - used_pct))
      [ "$remaining_pct" -lt 0 ] && remaining_pct=0
      [ "$remaining_pct" -gt 100 ] && remaining_pct=100

      # 根据剩余百分比选择颜色
      if [ "$remaining_pct" -le 20 ]; then
        context_color="$C_CTX_RED"
      elif [ "$remaining_pct" -le 40 ]; then
        context_color="$C_CTX_YELLOW"
      else
        context_color="$C_CTX_GREEN"
      fi

      # 格式化输出（显示剩余百分比）
      context_info="${remaining_pct}%"
    fi
  fi
fi

# 如果没有获取到有效数据，显示占位符
[ -z "$context_info" ] && context_info="--"

# ---- 输出状态行 ----
if [ "$use_color" -eq 1 ]; then
  printf "${C_DIR}%s${C_RESET}" "$current_dir"
  [ -n "$git_branch" ] && printf "  ${C_GIT}%s${C_RESET}" "🌿 $git_branch"
  printf "  ${C_MODEL}%s${C_RESET}" "🤖 $model_name"
  [ -n "$cc_version" ] && printf "  ${C_VERSION}%s${C_RESET}" "v$cc_version"
  printf "  ${context_color}%s${C_RESET}" "🧠 $context_info"
else
  printf "%s" "$current_dir"
  [ -n "$git_branch" ] && printf "  %s" "$git_branch"
  printf "  %s" "$model_name"
  [ -n "$cc_version" ] && printf "  v%s" "$cc_version"
  printf "  %s" "$context_info"
fi

printf '\n'
