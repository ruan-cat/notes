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
C_COST='\033[38;5;222m'       # 成本 - 浅金色
C_BURN='\033[38;5;220m'       # 燃烧率 - 亮金色
C_USAGE='\033[38;5;189m'      # 用量 - 淡紫色
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

# 进一步缩短路径：显示最后 2 级目录
# 支持 Unix 路径 (/) 和 Windows 路径 (\)
if [[ "$current_dir" == */* ]] || [[ "$current_dir" == *\\* ]]; then
  # 统一处理反斜杠为正斜杠
  current_dir=$(echo "$current_dir" | sed 's|\\|/|g')

  # 统计斜杠数量
  slash_count=$(echo "$current_dir" | tr -cd '/' | wc -c)

  if [ "$slash_count" -gt 2 ]; then
    # 使用 awk 提取最后 2 级目录（更可靠）
    last_two=$(echo "$current_dir" | awk -F'/' '{print $(NF-1)"/"$NF}')
    if [ -n "$last_two" ]; then
      current_dir="📁 .../$last_two"
    fi
  else
    current_dir="📁 $current_dir"
  fi
else
  current_dir="📁 $current_dir"
fi

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

# ---- 成本和使用情况分析 ----
cost_info=""
usage_info=""

if [ "$HAS_JQ" -eq 1 ]; then
  # 获取成本数据
  cost_usd=$(echo "$input" | jq -r '.cost.total_cost_usd // empty' 2>/dev/null)
  total_duration_ms=$(echo "$input" | jq -r '.cost.total_duration_ms // empty' 2>/dev/null)

  # 计算燃烧率 ($/hour)
  if [ -n "$cost_usd" ] && [ -n "$total_duration_ms" ] && [ "$total_duration_ms" -gt 0 ]; then
    cost_per_hour=$(echo "$cost_usd $total_duration_ms" | awk '{printf "%.2f", $1 * 3600000 / $2}')
  fi

  # 获取 Token 使用情况 (如果安装了 ccusage)
  if command -v ccusage >/dev/null 2>&1; then
    # 尝试获取 blocks 信息，设置超时防止卡顿
    blocks_output=""
    if command -v timeout >/dev/null 2>&1; then
      blocks_output=$(timeout 1s ccusage blocks --json 2>/dev/null)
    elif command -v gtimeout >/dev/null 2>&1; then
      blocks_output=$(gtimeout 1s ccusage blocks --json 2>/dev/null)
    else
      # 无 timeout 命令，直接运行
      blocks_output=$(ccusage blocks --json 2>/dev/null)
    fi

    if [ -n "$blocks_output" ]; then
      active_block=$(echo "$blocks_output" | jq -c '.blocks[] | select(.isActive == true)' 2>/dev/null | head -n1)
      if [ -n "$active_block" ]; then
        tot_tokens=$(echo "$active_block" | jq -r '.totalTokens // empty')
        tpm=$(echo "$active_block" | jq -r '.burnRate.tokensPerMinute // empty')
      fi
    fi
  fi
fi

# 格式化成本信息
if [ -n "$cost_usd" ] && [[ "$cost_usd" =~ ^[0-9.]+$ ]]; then
  cost_formatted=$(printf '%.2f' "$cost_usd")
  if [ "$use_color" -eq 1 ]; then
    if [ -n "$cost_per_hour" ] && [[ "$cost_per_hour" =~ ^[0-9.]+$ ]]; then
      cost_per_hour_formatted=$(printf '%.2f' "$cost_per_hour")
      cost_info="${C_COST}💰 \$${cost_formatted}${C_RESET} (${C_BURN}\$${cost_per_hour_formatted}/h${C_RESET})"
    else
      cost_info="${C_COST}💰 \$${cost_formatted}${C_RESET}"
    fi
  else
    if [ -n "$cost_per_hour" ] && [[ "$cost_per_hour" =~ ^[0-9.]+$ ]]; then
      cost_per_hour_formatted=$(printf '%.2f' "$cost_per_hour")
      cost_info="💰 \$${cost_formatted} (\$${cost_per_hour_formatted}/h)"
    else
      cost_info="💰 \$${cost_formatted}"
    fi
  fi
fi

# 格式化使用信息
if [ -n "$tot_tokens" ] && [[ "$tot_tokens" =~ ^[0-9]+$ ]]; then
  if [ -n "$tpm" ] && [[ "$tpm" =~ ^[0-9.]+$ ]]; then
    tpm_formatted=$(printf '%.0f' "$tpm")
    if [ "$use_color" -eq 1 ]; then
      usage_info="${C_USAGE}📊 ${tot_tokens} tok (${tpm_formatted} tpm)${C_RESET}"
    else
      usage_info="📊 ${tot_tokens} tok (${tpm_formatted} tpm)"
    fi
  else
    if [ "$use_color" -eq 1 ]; then
      usage_info="${C_USAGE}📊 ${tot_tokens} tok${C_RESET}"
    else
      usage_info="📊 ${tot_tokens} tok"
    fi
  fi
fi

# ---- 输出状态行 ----
# 第一行：仅显示目录
if [ "$use_color" -eq 1 ]; then
  printf "${C_DIR}%s${C_RESET}" "$current_dir"
else
  printf "%s" "$current_dir"
fi

# 第二行：Git分支、模型、版本、上下文窗口
printf "\n"
if [ "$use_color" -eq 1 ]; then
  [ -n "$git_branch" ] && printf "${C_GIT}%s${C_RESET}" "🌿 $git_branch"
  [ -n "$git_branch" ] && printf "  "
  printf "${C_MODEL}%s${C_RESET}" "🤖 $model_name"
  [ -n "$cc_version" ] && printf "  ${C_VERSION}%s${C_RESET}" "v$cc_version"
  printf "  ${context_color}%s${C_RESET}" "🧠 $context_info"
else
  [ -n "$git_branch" ] && printf "%s" "$git_branch"
  [ -n "$git_branch" ] && printf "  "
  printf "%s" "$model_name"
  [ -n "$cc_version" ] && printf "  v%s" "$cc_version"
  printf "  %s" "🧠 $context_info"
fi

# 第三行：成本和使用信息（如果有）
if [ -n "$cost_info" ] || [ -n "$usage_info" ]; then
  printf "\n"
  [ -n "$cost_info" ] && printf "%b" "$cost_info"
  [ -n "$cost_info" ] && [ -n "$usage_info" ] && printf "  "
  [ -n "$usage_info" ] && printf "%b" "$usage_info"
fi

printf '\n'
