# 示例 spec.md 骨架（可直接复制使用）

## ADDED Requirements
### Requirement: 用户搜索功能
系统 MUST 提供用户搜索功能，支持按姓名与邮箱搜索。

#### Scenario: 按姓名搜索用户
- **WHEN** 用户输入姓名并提交搜索
- **THEN** 系统返回匹配的用户列表

#### Scenario: 按邮箱搜索用户
- **WHEN** 用户输入邮箱并提交搜索
- **THEN** 系统返回匹配的用户信息

## MODIFIED Requirements
### Requirement: 用户列表页面
- 变化说明：页面 MUST 提供搜索结果的分页与排序。
- 兼容性/约束：默认按创建时间降序，分页大小 20，可配置。

## REMOVED Requirements
### Requirement: 简单用户浏览
- Reason: 已被新的搜索能力替代。
- Migration: 用户应通过搜索功能查找目标用户。 

