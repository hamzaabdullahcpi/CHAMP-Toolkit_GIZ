import 'dotenv/config';

const baseId = process.env.AIRTABLE_BASE_ID!;
const pat = process.env.AIRTABLE_PAT!;

if (!baseId || !pat) {
  console.error("Missing AIRTABLE_BASE_ID or AIRTABLE_PAT");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${pat}`,
  'Content-Type': 'application/json',
};

async function airtableRequest(endpoint: string, method = 'GET', body?: any) {
  const url = `https://api.airtable.com/v0/${baseId}/${endpoint}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Airtable ${method} ${endpoint} failed: ${res.status} ${res.statusText} - ${JSON.stringify(data)}`);
  }
  return data;
}

async function run() {
  const p31Id = 'recG7wIxVJgnhPW6M';
  const p32Id = 'rec3uo1IBCauiEimf';
  const p33Id = 'recRTFUoxTWXKiQFA';

  const pathway11Id = 'recWGEx5x7YpvT9ZP';
  const pathway12Id = 'rec8KPHGxRyncsXYg';
  const pathway13Id = 'rec9uVdifwHMNd1Aa';
  const pathway42Id = 'rechG5sx4ide7Zsxo';
  const pathway43Id = 'recHLUhrtlsbUNkCb';

  // 1. Fetch existing guidance steps for 3.1, 3.2, 3.3 and delete them
  let allGuidance: any[] = [];
  let offset = '';
  do {
    const res = await airtableRequest(`Implementation%20Guidance?pageSize=100${offset ? `&offset=${offset}` : ''}`);
    allGuidance = allGuidance.concat(res.records || []);
    offset = res.offset;
  } while (offset);

  const guidanceToDelete = allGuidance.filter(r => {
    const b = r.fields['Belongs to Pathway'] || [];
    return b.includes(p31Id) || b.includes(p32Id) || b.includes(p33Id);
  });

  console.log('Deleting', guidanceToDelete.length, 'existing guidance steps for Action 3...');
  for (const g of guidanceToDelete) {
    await airtableRequest(`Implementation%20Guidance/${g.id}`, 'DELETE');
  }

  // 2. Re-create accurate guidance steps from Docx
  const accurateGuidance = [
    // Pathway 3.1
    {
      fields: {
        'Step Title': 'Establish enabling frameworks for local climate budgeting',
        'Step Order': 1,
        'Detailed Content': 'Work with subnational governments to develop common climate budget taxonomies, methodologies, and reporting standards. Where needed, align national accounting rules, budget formats, and fiscal regulations to enable their integration into municipal budgeting and capital investment planning (see Pathway 1.2).',
        'Belongs to Pathway': [p31Id],
        'Related Pathways': [pathway12Id]
      }
    },
    {
      fields: {
        'Step Title': 'Support climate-informed investment planning',
        'Step Order': 2,
        'Detailed Content': 'Provide guidance and technical assistance to help cities estimate climate investment costs, assess available resources and funding gaps, and prioritize investments in multiyear financial and capital investment plans. Identify where national funding, fiscal transfers, or additional financing may be required.',
        'Belongs to Pathway': [p31Id]
      }
    },
    {
      fields: {
        'Step Title': 'Connect investment planning with portfolios and pipelines',
        'Step Order': 3,
        'Detailed Content': 'Use local budgets and investment plans to inform the development of coordinated climate portfolios and project pipelines (see Pathway 3.2)',
        'Belongs to Pathway': [p31Id],
        'Related Pathways': [p32Id]
      }
    },
    {
      fields: {
        'Step Title': 'Support monitoring and improvement',
        'Step Order': 4,
        'Detailed Content': 'Encourage consistent reporting on climate-related budget allocations, expenditure, and results. Use findings to improve national guidance and municipal budgeting practices over time.',
        'Belongs to Pathway': [p31Id]
      }
    },

    // Pathway 3.2
    {
      fields: {
        'Step Title': 'Support portfolio development',
        'Step Order': 1,
        'Detailed Content': 'Convene relevant national and subnational institutions to identify complementary projects and interventions around shared climate priorities. These may include infrastructure, policy, regulatory and capacity-building measures, with clear responsibilities and sequencing. Ensure that the portfolios remained aligned with NDC commitments (see Pathway 1.1).',
        'Belongs to Pathway': [p32Id],
        'Related Pathways': [pathway11Id]
      }
    },
    {
      fields: {
        'Step Title': 'Identify project pipelines',
        'Step Order': 2,
        'Detailed Content': 'Assess which projects within portfolios have potential for further preparation and financing. Consider their climate impact, investment requirements, and current readiness.',
        'Belongs to Pathway': [p32Id]
      }
    },
    {
      fields: {
        'Step Title': 'Explore financing pathways',
        'Step Order': 3,
        'Detailed Content': 'Identify projects requiring additional development finance or borrowing or having potential for private investment. Flag projects requiring further risk reduction (see Pathway 4.2).',
        'Belongs to Pathway': [p32Id],
        'Related Pathways': [pathway42Id]
      }
    },
    {
      fields: {
        'Step Title': 'Explore project aggregation',
        'Step Order': 4,
        'Detailed Content': 'Where cities have similar investment needs, explore coordinated project pipelines or common investment programs to achieve scale and improve access to finance (see Pathway 4.3).',
        'Belongs to Pathway': [p32Id],
        'Related Pathways': [pathway43Id]
      }
    },
    {
      fields: {
        'Step Title': 'Establish portfolio coordination arrangements',
        'Step Order': 5,
        'Detailed Content': 'Assign responsibility for maintaining portfolios, coordinating institutions and tracking progress across projects and other interventions (see Pathway 1.3).',
        'Belongs to Pathway': [p32Id],
        'Related Pathways': [pathway13Id]
      }
    },

    // Pathway 3.3
    {
      fields: {
        'Step Title': 'Strengthen subnational access to project preparation',
        'Step Order': 1,
        'Detailed Content': 'Establish or strengthen national project preparation facilities (PPFs) or connect municipal pipelines with existing national and international PPFs. Provide funding and technical assistance where needed.',
        'Belongs to Pathway': [p33Id]
      }
    },
    {
      fields: {
        'Step Title': 'Engage financing partners early',
        'Step Order': 2,
        'Detailed Content': 'Involve national development banks, multilateral development banks, climate funds and other potential financiers to understand their investment requirements. Use their inputs to guide urban and subnational project preparation.',
        'Belongs to Pathway': [p33Id]
      }
    },
    {
      fields: {
        'Step Title': 'Coordinate preparation support',
        'Step Order': 3,
        'Detailed Content': 'Identify similar project preparation needs across municipalities. Explore shared technical assistance, standardized approaches, or pooled preparation resources to reduce preparation costs and improve efficiency. Leverage a country platform where available (see Pathway 1.3).',
        'Belongs to Pathway': [p33Id],
        'Related Pathways': [pathway13Id]
      }
    },
    {
      fields: {
        'Step Title': 'Track project preparation outcomes',
        'Step Order': 4,
        'Detailed Content': 'Monitor progress from concept development through feasibility and financial structuring. Use findings to refine project pipelines and identify additional interventions or preparation needs. Address delays and connect sufficiently prepared projects with national and international financing opportunities (see Pathways 1.3, 3.2, 4.2).',
        'Belongs to Pathway': [p33Id],
        'Related Pathways': [pathway13Id, p32Id, pathway42Id]
      }
    }
  ];

  for (let i = 0; i < accurateGuidance.length; i += 10) {
    const chunk = accurateGuidance.slice(i, i + 10);
    await airtableRequest('Implementation%20Guidance', 'POST', { records: chunk });
  }
  console.log('Successfully re-created', accurateGuidance.length, 'guidance steps.');

  // 3. Fetch existing resources and update fullText / connectionLine
  let allResources: any[] = [];
  offset = '';
  do {
    const res = await airtableRequest(`Key%20Resources?pageSize=100${offset ? `&offset=${offset}` : ''}`);
    allResources = allResources.concat(res.records || []);
    offset = res.offset;
  } while (offset);

  const resourcesToDelete = allResources.filter(r => {
    const b = r.fields['Belongs to Pathway'] || [];
    return b.includes(p31Id) || b.includes(p32Id) || b.includes(p33Id);
  });

  console.log('Deleting', resourcesToDelete.length, 'existing resources for Action 3...');
  for (const r of resourcesToDelete) {
    await airtableRequest(`Key%20Resources/${r.id}`, 'DELETE');
  }

  const accurateResources = [
    // 3.1
    {
      fields: {
        'Example Title': 'India – CapaCITIES Program',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Key takeaway: India shows how national institutions and development partners can support local climate investment planning and connect it with national programs.',
        'Full Text / Concept Explanation': 'Launched in 2016 with Swiss funding, CapaCITIES supported cities in developing Net-Zero Climate Resilient City Action Plans, identifying priority investments and strengthening municipal capacities. The National Institute of Urban Affairs (NIUA), an autonomous institution under the Ministry of Housing and Urban Affairs, partnered with the program to ensure alignment of methodologies with national standards, facilitate engagement with municipal governments, adapt program tools for national use and connect project learnings with national policies and programs. Across participating cities, the plans identified INR 7,142 billion (around USD 73 billion) in climate investment needs. A notable example is Tirunelveli city’s Net Zero Climate-Resilient Cities Action Plan, supported by NIUA under CapaCITIES, which identifies priority investments, indicative costs, potential financing sources and implementation responsibilities.',
        'Learn More URL': 'https://capacitiesindia.org/',
        'Belongs to Pathway': [p31Id]
      }
    },
    {
      fields: {
        'Example Title': 'Philippines – Local Climate Change Expenditure Tagging',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Key takeaway: The Philippines shows how national regulations, common methodologies, and technical support can integrate climate priorities into local investment planning and budgeting.',
        'Full Text / Concept Explanation': 'The Philippines institutionalized local climate expenditure tagging through joint national guidelines that linked climate priorities with local investment programs and annual budgets. In 2015, the Climate Change Commission (CCC), Department of Budget and Management (DBM), and Department of the Interior and Local Government (DILG) issued joint guidelines for tagging climate-related expenditure in local Annual Investment Programs (AIPs), which identify planned local projects, activities, costs and funding sources for annual budgeting. The guidelines introduced common climate expenditure classifications, revised investment program forms and reporting procedures. To support their adoption, the DBM incorporates tagging into local budget guidance, the CCC guides local governments in classifying climate-related expenditure and reviews the accuracy of these classifications. At the same time, the DILG facilitates implementation across local governments. Using these guidelines, provinces, cities, and municipalities identify climate-related allocations and funding sources through their AIPs and prepare investment briefs to support prioritization, expenditure monitoring, and identification of financing needs.',
        'Learn More URL': 'https://climate.gov.ph/files/CCET%20LGU%20Final.pdf',
        'Belongs to Pathway': [p31Id]
      }
    },
    {
      fields: {
        'Example Title': "Sweden – Stockholm's Climate Budgeting and Investment Planning",
        'Type': 'Peer Learning Example',
        'Order': 3,
        'What you can learn / Why use this': 'Key takeaway: Stockholm shows how municipal climate budgeting and investment planning can connect with national–local coordination processes.',
        'Full Text / Concept Explanation': "Stockholm incorporates climate targets and implementation responsibilities into its annual financial budget, with progress monitored through the city's management system. Municipal departments and companies can also access a dedicated climate investment fund to support priority measures. As part of its Climate City Contract (CCC) under the EU Cities Mission, Stockholm prepared a 2030 Climate Neutrality Investment Plan outlining how the city's transition could be financed, including investment responsibilities beyond the municipality. This planning takes place within Sweden's broader CCC process, coordinated through Viable Cities in partnership with national government agencies. The process provides a framework for national–local collaboration on climate priorities, investment needs and financing arrangements.",
        'Learn More URL': 'https://netzerocities.app/_content/files/knowledge/4060/stockholm_nzc_ccc.pdf',
        'Belongs to Pathway': [p31Id]
      }
    },
    {
      fields: {
        'Example Title': 'C40 Climate Budgeting Framework',
        'Type': 'Tool',
        'Order': 4,
        'What you can learn / Why use this': 'Why use this tool: This framework helps cities integrate climate priorities into their budgeting and identify opportunities for national support, including financing and enabling regulations.',
        'Full Text / Concept Explanation': "The C40 Climate Budgeting Framework (CBF) helps cities to establish climate budgeting processes that connect climate targets with annual or multiyear budget decisions. It covers operating and capital budgets, emphasizes leadership by municipal finance departments and coordination across departments and integrates implementation responsibilities, monitoring, and learning into regular budget cycles. C40's accompanying guidance highlights how cities can use climate budgets to engage national governments on financing priority climate investments. National governments can further support adoption through compatible public-finance regulations, common budgeting guidance, and technical assistance.",
        'Learn More URL': 'https://www.c40knowledgehub.org/s/article/Climate-budgeting-framework?language=en_US',
        'Belongs to Pathway': [p31Id]
      }
    },
    {
      fields: {
        'Example Title': 'NDC Partnership and Green Climate Fund – Climate Investment Planning and Mobilization Framework',
        'Type': 'Tool',
        'Order': 5,
        'What you can learn / Why use this': 'Why use this tool: Structure national climate investment planning, including coordination among relevant government institutions and stakeholders.',
        'Full Text / Concept Explanation': 'Developed by the NDC Partnership and Green Climate Fund, this framework guides governments through climate investment planning and finance mobilization. It helps to translate NDCs, adaptation plans, and long-term climate strategies into investment priorities and finance mobilization approaches. The framework recommends engaging subnational authorities, aligning national investment planning with existing subnational investment frameworks, and reviewing financing needs and gaps across government levels. It also supports incorporating existing subnational investment priorities and pipelines into country-level planning.',
        'Learn More URL': 'https://climateinvestment.ndcpartnership.org/',
        'Belongs to Pathway': [p31Id]
      }
    },

    // 3.2
    {
      fields: {
        'Example Title': 'European Union – Mission for Climate-Neutral and Smart Cities',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Key takeaway: The EU Cities Mission shows how common frameworks, technical assistance, and multilevel collaboration can support cities in developing coordinated climate investment portfolios.',
        'Full Text / Concept Explanation': 'The EU Cities Mission supports 112 selected cities in developing Climate City Contracts through the NetZeroCities platform. These contracts include Climate Neutrality Action Plans that bring together infrastructure, policy, governance, and other interventions into coordinated portfolios. Cities also develop complementary Climate Neutrality Investment Plans that assess the capital needed to deliver these portfolios and identify potential public and private financing sources. The portfolio approach helps cities to move beyond individual projects and organize interventions around a shared climate mission, while involving local, regional, and national stakeholders.',
        'Learn More URL': 'https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe/eu-missions-horizon-europe/climate-neutral-and-smart-cities_en',
        'Belongs to Pathway': [p32Id]
      }
    },
    {
      fields: {
        'Example Title': 'Egypt - EBRD Green Cities Green City Action Plans',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Key takeaway: These plans show how development banks and national urban institutions can support city-level portfolio development, combining infrastructure investments with policy and institutional measures.',
        'Full Text / Concept Explanation': 'EBRD Green Cities illustrates how multilateral development banks and national institutions can support cities in developing integrated portfolios of climate projects and policy interventions. Participating cities use Green City Action Plans to assess environmental challenges, identify priorities, and develop pipelines of infrastructure investments, along with policy reforms and institutional measures. The plans identify expected benefits and costs, financing options, and implementation responsibilities. The EBRD supports the process through technical assistance, policy dialogue and infrastructure financing. In Egypt, the Green City Action Plan for 6th of October City was developed with the involvement of the New Urban Communities Authority (NUCA), a national government authority, and the city administration. Together, they engaged stakeholders to identify environmental priorities and develop a coordinated portfolio.',
        'Learn More URL': 'https://www.ebrdgreencities.com/',
        'Belongs to Pathway': [p32Id]
      }
    },
    {
      fields: {
        'Example Title': 'Brazil – Green and Resilient Cities Programme (PCVR) Project Bank',
        'Type': 'Peer Learning Example',
        'Order': 3,
        'What you can learn / Why use this': 'Key takeaway: Brazil shows how national programs can consolidate municipal climate project proposals and identify investment needs.',
        'Full Text / Concept Explanation': 'Brazil illustrates how a national program can identify and coordinate urban climate investment pipelines. Developed through a partnership involving the Ministry of the Environment and Climate Change, CCFLA, and the University of Brasília, the PCVR Project Bank consolidates information on climate-related projects submitted by municipalities, states and public enterprises. The bank has received 733 project submissions, including 487 submitted by municipal governments. The projects that reported estimated costs together require approximately BRL 14.1 billion (USD 2.6 billion) in financing. By mapping projects across sectors and stages of development, the bank provides an overview of local investment needs and opportunities for project preparation. This can help development banks, technical assistance providers, and financing partners identify opportunities to support municipal investment pipelines in Brazil.',
        'Learn More URL': 'https://citiesclimatefinance.org/pcvr-project-bank',
        'Belongs to Pathway': [p32Id]
      }
    },

    // 3.3
    {
      fields: {
        'Example Title': 'South Africa – DBSA Municipal Project Preparation',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Key takeaway: South Africa’s national development bank pools project preparation resources and expertise to support municipal infrastructure investment.',
        'Full Text / Concept Explanation': 'The Development Bank of Southern Africa (DBSA) manages ZAR 50 million (around USD 3 million) in project preparation funding through the national Infrastructure Fund for six municipalities, including Vhembe, Ugu, and Sol Plaatje. The program supports water, sanitation, and electricity infrastructure projects through technical, financial, economic, environmental, and socioeconomic feasibility studies. DBSA also helps municipalities to utilize implementation models, structure project financing, and explore blended finance and private-sector participation. The program aims to develop bankable municipal infrastructure projects and attract public and private investment.',
        'Learn More URL': 'https://www.dbsa.org/projects/six-municipalities-project-preparation',
        'Belongs to Pathway': [p33Id]
      }
    },
    {
      fields: {
        'Example Title': 'Indonesia – Project Development Facility, Regional Infrastructure Development Fund',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Key takeaway: Indonesia shows how national development finance institutions can combine dedicated project preparation support with infrastructure lending to strengthen subnational investment pipelines.',
        'Full Text / Concept Explanation': 'Indonesia illustrates how a national development finance institution can support subnational governments in preparing infrastructure projects for investment. PT Sarana Multi Infrastruktur (PT SMI), a state-owned institution under the Ministry of Finance, implemented the Regional Infrastructure Development Fund (RIDF), supported by the World Bank and Asian Infrastructure Investment Bank. Alongside infrastructure lending, RIDF established a Project Development Facility to help subnational governments identify and prepare projects through feasibility studies, detailed engineering designs, environmental and social assessments, and procurement support. The facility was supported by a USD 3 million grant for technical assistance, complementing the fund\'s infrastructure lending. This helped address municipal project preparation gaps and connect local infrastructure proposals with financing opportunities.',
        'Learn More URL': 'https://ftp.ptsmi.co.id/ridf-en',
        'Belongs to Pathway': [p33Id]
      }
    },
    {
      fields: {
        'Example Title': 'CCFLA – Project Preparation Resource Directory',
        'Type': 'Tool',
        'Order': 3,
        'What you can learn / Why use this': 'Why use this tool: Identify suitable project preparation facilities that can provide technical and financial support for preparing urban climate projects.',
        'Full Text / Concept Explanation': 'The Directory helps subnational governments and stakeholders identify project preparation facilities (PPFs) that can support them in developing green and resilient infrastructure, including implementing more efficient heating and cooling systems, building renewable energy, setting up sustainable transit, or climate-proofing resilient infrastructure. Users can filter information by region, country, sector, project stage, etc., to find PPFs for their project needs.',
        'Learn More URL': 'https://citiesclimatefinance.org/project-preparation-resource-directory',
        'Belongs to Pathway': [p33Id]
      }
    },
    {
      fields: {
        'Example Title': 'NDC Partnership - Project Preparation Support Database',
        'Type': 'Tool',
        'Order': 4,
        'What you can learn / Why use this': 'Why use this tool: Find project preparation facilities and support programs that match climate investment priorities and project development needs.',
        'Full Text / Concept Explanation': 'This searchable database of international, regional, national, and subnational project preparation facilities is focused on supporting the preparation of climate-aligned projects, as well as incubators and accelerators supporting climate-aligned businesses.',
        'Learn More URL': 'https://ndcpartnership.org/knowledge-portal/project-preparation-support-database/about',
        'Belongs to Pathway': [p33Id]
      }
    },
    {
      fields: {
        'Example Title': 'ICLEI and Gap Fund - Capacity Development Toolkit for Early-Stage Project Preparation',
        'Type': 'Tool',
        'Order': 5,
        'What you can learn / Why use this': 'Why use this tool: A toolkit for strengthening municipal capacities to assess project feasibility, address preparation gaps, and improve investment readiness.',
        'Full Text / Concept Explanation': 'The toolkit provides 12 practical tools and templates developed through the Gap Fund Step-Up Project with cities in Africa and South America. It helps city officials and technical partners assess technical capacity and data gaps, map stakeholders and risks, develop basic financial models, and evaluate financing options. Each tool includes practical guidance and adaptable templates to strengthen early-stage project preparation.',
        'Learn More URL': 'https://iclei.org/e-library/a-capacity-development-toolkit-for-early-stage-project-preparation/',
        'Belongs to Pathway': [p33Id]
      }
    },
    {
      fields: {
        'Example Title': 'Urban-Act - Early-Stage City Climate Project Bankability Diagnostic Tool',
        'Type': 'Tool',
        'Order': 6,
        'What you can learn / Why use this': 'Why use this tool: Identify bankability gaps in early-stage climate projects and determine the technical and financial preparation needed to address them.',
        'Full Text / Concept Explanation': 'The tool is designed to support cities during the early stages of project preparation, from concept to pre-feasibility by applying a project finance lens to improve project viability and financeability. It offers tailored checklists across six thematic investment areas to identify bankability gaps and finance-readiness issues, along with practical sector-specific recommendations to strengthen project design, financial viability, and access to climate finance.',
        'Learn More URL': 'https://repository.unescap.org/items/6268f5a1-9051-4007-ab6d-5c174bec64a5',
        'Belongs to Pathway': [p33Id]
      }
    },
    {
      fields: {
        'Example Title': 'SOURCE – Sustainable Infrastructure Project Preparation Platform',
        'Type': 'Tool',
        'Order': 7,
        'What you can learn / Why use this': 'Why use this tool: Standardize infrastructure project preparation across government institutions and improve project quality, transparency, and investment readiness.',
        'Full Text / Concept Explanation': 'SOURCE is a digital project preparation and management platform developed through a multilateral development bank initiative and coordinated by the Sustainable Infrastructure Foundation. It provides standardized, sector-specific templates to help governments define, prepare, and manage sustainable infrastructure projects throughout their lifecycle. Its features include project monitoring, document management, preparation guidance and tools for connecting projects with preparation facilities and potential financiers. SOURCE is used in more than 50 countries.',
        'Learn More URL': 'https://www.greenfinanceplatform.org/organization/sustainable-infrastructure-foundation-sif-source',
        'Belongs to Pathway': [p33Id]
      }
    }
  ];

  for (let i = 0; i < accurateResources.length; i += 10) {
    const chunk = accurateResources.slice(i, i + 10);
    await airtableRequest('Key%20Resources', 'POST', { records: chunk });
  }
  console.log('Successfully re-created', accurateResources.length, 'resources.');
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
