# ⚙️ Módulo 3: Infraestrutura & Super Admin

**Objetivo:** Garantir a estabilidade, segurança (Multi-tenant) e escalabilidade do sistema.

## Prioridades (MoSCoW)

### 🔴 Must Have (Obrigatório para MVP)
| ID | Tarefa | Descrição |
| :--- | :--- | :--- |
| **INF-01** | **Setup Supabase** | Criar projeto, configurar tabelas e chaves de API. |
| **INF-02** | **Row Level Security (RLS)** | Configurar Policies para garantir isolamento de dados entre lojas. |
| **INF-03** | **Triggers de Cadastro** | Função SQL para criar entrada na tabela `stores` ao criar usuário no Auth. |
| **INF-04** | **Setup Storage** | Bucket público para imagens de produtos e logos. |

### 🟡 Should Have (Importante)
| ID | Tarefa | Descrição |
| :--- | :--- | :--- |
| **INF-05** | **Scraper/Base Mestre** | Popular `master_products` com 1000-2000 itens comuns (EAN, Nome, Foto). |

### ⚪ Won't Have (Fora do Escopo Atual)
- Billing Automático (Cobrança de mensalidade via cartão). Gestão será manual no início.
- Domínios personalizados (`mercadodoze.com.br` ao invés de subdomínio).
