# OpenSpec 增量规范模板（自定义复用）

## 1. 使用说明

- 将本模板复制到 `openspec/changes/<change>/specs/<capability>/spec.md`，再替换占位符。
- 保持 Delta 分区标题使用英文，勿添加数字或额外前缀。
- Requirement 使用 MUST/SHALL 等强制关键词，Scenario 使用英文 Gherkin 关键字（WHEN/THEN/AND），描述可中文。
- 如需删除需求，务必填写 Reason/Migration。

## 2. 模板正文

```markdown
## ADDED Requirements
### Requirement: <能力名称>
系统 MUST 提供 <能力描述>。

#### Scenario: <场景1>
- **WHEN** <前置条件>
- **THEN** <预期结果>

#### Scenario: <场景2>
- **WHEN** <前置条件>
- **THEN** <预期结果>

## MODIFIED Requirements
### Requirement: <被修改的能力>
- 变化说明：...
- 兼容性/约束：...

## REMOVED Requirements
### Requirement: <被移除的能力>
- Reason: ...
- Migration: ...
```

