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

async function main() {
  console.log("=== UPDATING ACTION 1 IN AIRTABLE ===");

  // 1. Update Action 1 record
  console.log("1. Updating Action 1...");
  await airtableRequest('Actions/recQ8Zb1myageh9SH', 'PATCH', {
    fields: {
      'Title': 'Establish Multilevel Commitments and Platforms for Climate Investment',
      'Description': 'Action 1 helps national governments align national climate commitments with city and subnational priorities and establish platforms for coordinated implementation and investment. It supports governments to translate NDCs and other national commitments into shared priorities, clarify responsibilities, and connect local investment needs with national and international support.',
      'Systems Logic': 'Climate investment requires shared priorities and sustained coordination across government levels. Joint commitments can connect NDCs and other national goals with local priorities, responsibilities, and investment needs. National coordination mechanisms can facilitate ongoing collaboration between governments and wider implementation actors. Country platforms can then connect urban priorities with national investment strategies and finance partners. Together, these mechanisms create the institutional foundations for investment planning, finance mobilization, and implementation.'
    }
  });

  // 2. Update Pathways
  console.log("2. Updating Pathways 1.1, 1.2, 1.3...");
  const pathway11Id = 'recWGEx5x7YpvT9ZP';
  const pathway12Id = 'rec8KPHGxRyncsXYg';
  const pathway13Id = 'rec9uVdifwHMNd1Aa';

  await airtableRequest(`Pathways/${pathway11Id}`, 'PATCH', {
    fields: {
      'Pathway Title': '1.1 Multilevel Climate Commitments',
      'Overview': 'Multilevel climate commitments align national, subnational, and city governments around shared climate priorities and responsibilities. These commitments can be embedded in existing NDCs, NAPs, and national climate strategies, or established through complementary agreements and processes. They help connect national climate goals with local priorities, investment needs, and implementation responsibilities, creating a clearer basis for coordinating climate finance and action across government levels.',
      'Potential National Lead': ['Climate / Environment Ministry', 'Urban / Local Government Ministry'],
      'Key Actors': ['Planning Ministry', 'Finance Ministry', 'Relevant Sector Ministries', 'City / Subnational Governments', 'City Networks'],
      'Transferability Considerations': 'Adapting this pathway to your context\n• Embed multilevel commitments within NDCs, NAPs or national climate strategies, or establish new agreements where existing processes are insufficient.\n• Consider setting a small set of core commitments for participating governments, while allowing them to make additional or more ambitious commitments based on their priorities, capacities, and readiness.\n• Consider whether to engage cities directly, through subnational government associations or through phased participation, depending on your country\'s governance arrangements and local capacities.\n• Consider whether a dedicated urban climate implementation strategy is needed, or whether existing national, sectoral, and subnational plans can provide a sufficient framework for implementation.'
    }
  });

  await airtableRequest(`Pathways/${pathway12Id}`, 'PATCH', {
    fields: {
      'Pathway Title': '1.2 National Coordination Mechanisms',
      'Overview': 'National coordination mechanisms provide a structure for national and subnational governments to coordinate climate investment and implementation. They connect local priorities with national policies, programs, finance, and technical support. They can also enable whole-of-society engagement, bringing in businesses, financial institutions, academia, civil society and communities where needed. To sustain this coordination, mechanisms can include dedicated capacity to convene actors day-to-day, follow up on financing and implementation needs, and bring local feedback into national decision-making.',
      'Potential National Lead': ['Climate / Environment Ministry', 'Urban / Local Government Ministry'],
      'Key Actors': ['Planning Ministry', 'Finance Ministry', 'Relevant Sector Ministries', 'City / Subnational Governments', 'National Development Bank', 'City Networks', 'Private Sector', 'Academia / Research', 'Civil Society', 'Community Stakeholders'],
      'Transferability Considerations': 'Adapting this pathway to your context\n• Establish the coordination mechanism suited to the governance system and institutional capacities – this could be a national coordination platform, recurring dialogue series, or other arrangements.\n• Depending on institutional mandates and coordination capacities, you can lead coordination nationally, share leadership across government levels or engage intermediaries such as city networks to facilitate the process.\n• Where cities have different levels of technical and institutional capacity, consider providing additional support to ensure that lower-capacity municipalities can participate effectively in coordination and investment discussions.\n• Involve different national institutions and external partners depending on the issues being addressed. Financing challenges may require finance ministries, development banks, and investors, while sector-specific barriers may also require sector ministries.'
    }
  });

  await airtableRequest(`Pathways/${pathway13Id}`, 'PATCH', {
    fields: {
      'Pathway Title': '1.3 Urban-Inclusive Country Platforms',
      'Overview': 'Urban-inclusive country platforms bring city and subnational priorities into nationally led processes for mobilizing climate and development finance. Country platforms align governments and development partners around shared missions, such as climate action. Cities and subnational governments, however, are often not systematically represented in these platforms, despite their important roles in climate action. Urban-inclusive platforms can address this gap by integrating urban and subnational priorities into platform governance, investment planning, and financing. This can align national and local climate plans, strengthen urban project pipelines, and mobilize public, development, and private finance for local climate action. Participation in country platforms can also bring cities and subnational governments closer to global climate finance platforms and international partners, creating opportunities to access technical assistance, partnerships and financing support.',
      'Potential National Lead': ['Finance Ministry'],
      'Key Actors': ['Climate / Environment Ministry', 'Urban / Local Government Ministry', 'Relevant Sector Ministries', 'City / Subnational Governments', 'National Development Bank', 'MDB / DFI', 'Bilateral Agencies', 'PPF', 'City Networks', 'Private Investors'],
      'Transferability Considerations': 'Adapting this pathway to your context\n• Assign leadership to finance or planning ministries or other national government institutions, depending on national responsibilities for investment planning and finance mobilization.\n• Consider whether cities should participate directly or through regional governments, or city coalitions, depending on your country\'s governance system and number of jurisdictions.\n• Consider whether small cities and those with limited technical or financial capacities may need additional project preparation support or financial intermediation to participate effectively.\n• Begin with investment portfolios in priority sectors and expand over time. Financing arrangements should reflect local borrowing powers, creditworthiness, and access to capital.'
    }
  });

  // 3. Update Implementation Guidance for 1.1, 1.2, 1.3
  console.log("3. Updating Implementation Guidance...");
  // Clear old guidance records for Action 1 pathways
  const allGuidance = await airtableRequest('Implementation%20Guidance');
  const action1Guidance = (allGuidance.records || []).filter((r: any) => {
    const belongs = r.fields['Belongs to Pathway'] || [];
    return belongs.includes(pathway11Id) || belongs.includes(pathway12Id) || belongs.includes(pathway13Id);
  });
  
  for (const g of action1Guidance) {
    await airtableRequest(`Implementation%20Guidance/${g.id}`, 'DELETE');
  }
  console.log(`Deleted ${action1Guidance.length} old guidance steps for Action 1.`);

  const newGuidance = [
    // 1.1
    {
      fields: {
        'Step Title': 'Assess existing national commitments',
        'Step Order': 1,
        'Detailed Content': 'Review NDCs, NAPs, national urban policies, and relevant sectoral strategies to identify existing commitments, targets, and responsibilities involving cities and subnational governments, as well as gaps in their inclusion.',
        'Belongs to Pathway': [pathway11Id]
      }
    },
    {
      fields: {
        'Step Title': 'Facilitate subnational commitments',
        'Step Order': 2,
        'Detailed Content': 'Support cities and subnational governments in developing climate commitments and strategies where these are absent, building on their existing priorities, plans, and institutional capacities.',
        'Belongs to Pathway': [pathway11Id]
      }
    },
    {
      fields: {
        'Step Title': 'Define complementary commitments and responsibilities',
        'Step Order': 3,
        'Detailed Content': 'Work with subnational governments to establish shared or complementary commitments, targets, and milestones. Clarify institutional responsibilities for delivery across government levels.',
        'Belongs to Pathway': [pathway11Id]
      }
    },
    {
      fields: {
        'Step Title': 'Connect commitments to investment planning',
        'Step Order': 4,
        'Detailed Content': 'Translate shared commitments into actionable investment priorities, portfolios, and pipelines, and integrate these into national and subnational budgeting (see Pathways 3.1 and 3.2).',
        'Belongs to Pathway': [pathway11Id]
      }
    },
    {
      fields: {
        'Step Title': 'Review and update commitments',
        'Step Order': 5,
        'Detailed Content': 'Regularly assess progress, financing needs, and implementation barriers. Use findings to update commitments and inform subsequent national and subnational planning, including future NDC revision and implementation cycles.',
        'Belongs to Pathway': [pathway11Id]
      }
    },
    // 1.2
    {
      fields: {
        'Step Title': 'Build on existing processes',
        'Step Order': 1,
        'Detailed Content': 'Identify where climate planning, budgeting, and financing decisions already take place. Strengthen related existing processes rather than creating additional coordination mechanisms.',
        'Belongs to Pathway': [pathway12Id]
      }
    },
    {
      fields: {
        'Step Title': 'Clarify institutional roles',
        'Step Order': 2,
        'Detailed Content': 'Define which national ministries and subnational institutions are responsible for financing, regulating, and implementing priority climate actions. Identify shared responsibilities and coordination needs across government levels and sectors.',
        'Belongs to Pathway': [pathway12Id]
      }
    },
    {
      fields: {
        'Step Title': 'Engage actors beyond government',
        'Step Order': 3,
        'Detailed Content': 'Identify businesses, financial institutions, academia, civil society, and community actors that influence climate action. Bring them into the coordination process to contribute finance, expertise, assets, and implementation capacity.',
        'Belongs to Pathway': [pathway12Id]
      }
    },
    {
      fields: {
        'Step Title': 'Connect coordination to investment decisions',
        'Step Order': 4,
        'Detailed Content': 'Use coordination mechanisms to identify investment needs, and mobilize investors, technical assistance providers, and decision-makers for implementation (see Pathways 1.3, 3.1 and 3.2).',
        'Belongs to Pathway': [pathway12Id]
      }
    },
    {
      fields: {
        'Step Title': 'Sustain coordination',
        'Step Order': 5,
        'Detailed Content': 'Identify a team or institution to convene actors, track local needs, and agreed actions, and facilitate follow-up across national and subnational governments.',
        'Belongs to Pathway': [pathway12Id]
      }
    },
    {
      fields: {
        'Step Title': 'Review progress and improve',
        'Step Order': 6,
        'Detailed Content': 'Regularly review implementation and financing barriers with subnational governments. Where needed, adjust shared commitments based on the reviews and feed lessons into policy or institutional reforms, program designs, funding decisions, and subsequent coordination cycles (see Pathway 1.1, 2.1 and 2.2).',
        'Belongs to Pathway': [pathway12Id]
      }
    },
    // 1.3
    {
      fields: {
        'Step Title': 'Establish national ownership and mandate',
        'Step Order': 1,
        'Detailed Content': 'Identify the national institution or group responsible for leading the platform. Define its purpose, responsibilities, and relationship with existing government processes.',
        'Belongs to Pathway': [pathway13Id]
      }
    },
    {
      fields: {
        'Step Title': 'Create entry points for cities',
        'Step Order': 2,
        'Detailed Content': 'Establish institutional arrangements for cities and subnational governments to bring finance and implementation needs into national discussions.',
        'Belongs to Pathway': [pathway13Id]
      }
    },
    {
      fields: {
        'Step Title': 'Align investment priorities',
        'Step Order': 3,
        'Detailed Content': 'Connect national climate and development objectives with city plans, investment portfolios, and project pipelines (see Pathways 1.1, 3.1, 3.2).',
        'Belongs to Pathway': [pathway13Id]
      }
    },
    {
      fields: {
        'Step Title': 'Coordinate project preparation support',
        'Step Order': 4,
        'Detailed Content': 'Engage project preparation facilities and development partners to strengthen urban pipelines and explore aggregation of smaller projects (see Pathway 3.3).',
        'Belongs to Pathway': [pathway13Id]
      }
    },
    {
      fields: {
        'Step Title': 'Engage financing partners',
        'Step Order': 5,
        'Detailed Content': 'Bring national and multilateral development banks, climate funds, and private financiers around urban investment needs. Identify suitable public, concessional, and private financing instruments (see Pathway 4.2).',
        'Belongs to Pathway': [pathway13Id]
      }
    },
    {
      fields: {
        'Step Title': 'Monitor progress and adapt support',
        'Step Order': 6,
        'Detailed Content': 'Track the implementation of urban or subnational portfolios. Use findings to adjust national support arrangements.',
        'Belongs to Pathway': [pathway13Id]
      }
    }
  ];

  // Batch insert new guidance (up to 10 at a time)
  for (let i = 0; i < newGuidance.length; i += 10) {
    const chunk = newGuidance.slice(i, i + 10);
    await airtableRequest('Implementation%20Guidance', 'POST', { records: chunk });
  }
  console.log(`Created ${newGuidance.length} new guidance steps.`);

  // 4. Update Key Resources / Peer Learning Examples / Tools
  console.log("4. Updating Key Resources and Peer Learning Examples...");
  const allResources = await airtableRequest('Key%20Resources');
  const action1Resources = (allResources.records || []).filter((r: any) => {
    const belongs = r.fields['Belongs to Pathway'] || [];
    return belongs.includes(pathway11Id) || belongs.includes(pathway12Id) || belongs.includes(pathway13Id);
  });

  for (const res of action1Resources) {
    await airtableRequest(`Key%20Resources/${res.id}`, 'DELETE');
  }
  console.log(`Deleted ${action1Resources.length} old resources for Action 1.`);

  const newResources = [
    // Pathway 1.1 Peer Learning Examples
    {
      fields: {
        'Example Title': 'Chile – 2025 Nationally Determined Contribution (NDC)',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Chile shows how multilevel climate and investment commitments can be embedded within an NDC.',
        'Full Text / Concept Explanation': 'Chile’s 2025 NDC includes specific subnational commitments covering regional and municipal climate plans, institutional capacity, and climate finance. Notably, the country commits to establishing a national network to identify, mobilize, and deploy subnational climate finance, with active participation from subnational governments. The NDC assigns responsibilities and deadlines for these commitments across government levels, creating a framework to link national ambition with local planning, finance, and implementation.',
        'Learn More URL': 'https://reporteclimatico.mma.gob.cl/ndc?',
        'Belongs to Pathway': [pathway11Id]
      }
    },
    {
      fields: {
        'Example Title': 'Sweden – Climate City Contract 2030',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Sweden shows how an iterative multilevel commitment process can link shared climate and investment goals across national and subnational governments.',
        'Full Text / Concept Explanation': 'As part of the Climate City Contracts, Swedish municipalities, national government agencies, and Viable Cities make commitments around a shared climate-neutrality mission and review them annually. The contracts connect climate goals with portfolios of projects and investment planning. The process has expanded from nine municipalities in 2019 to 48 municipalities.',
        'Learn More URL': 'https://viablecities.se/en/klimatneutrala-stader-2030/klimatkontrakt/',
        'Belongs to Pathway': [pathway11Id]
      }
    },
    {
      fields: {
        'Example Title': 'Rwanda – Nationally Determined Contribution 3.0',
        'Type': 'Peer Learning Example',
        'Order': 3,
        'What you can learn / Why use this': 'Rwanda shows how an NDC can connect national climate commitments with subnational investment planning and a national institution to mobilize and deploy climate finance.',
        'Full Text / Concept Explanation': 'Rwanda\'s nationally determined contribution (NDC) 3.0 commits to developing climate investment plans that can be implemented across all of the country’s 30 districts. The Rwanda Green Fund (RGF) and district authorities are among the institutions responsible for financing and implementing this commitment. The RGF already mobilizes climate finance and manages facilities that can finance national and local public-sector climate investments. This creates an institutional bridge between national climate commitments, district investment planning, and Rwanda\'s wider climate-finance architecture.',
        'Learn More URL': 'https://www.unfccc.int/sites/default/files/2025-12/Rwanda%20NDC3.0%20Final.pdf',
        'Belongs to Pathway': [pathway11Id]
      }
    },
    {
      fields: {
        'Example Title': 'International – Sustainable Urban Resilience for the Next Generation (SURGe) Initiative',
        'Type': 'Peer Learning Example',
        'Order': 4,
        'What you can learn / Why use this': 'SURGe shows how international initiatives can support multilevel climate commitments, sectoral collaboration and access to finance for urban climate action.',
        'Full Text / Concept Explanation': 'Launched at COP27 under the Egyptian Presidency, in collaboration with UN-Habitat and facilitated by ICLEI, SURGe brings together national and local governments, city networks and other partners to accelerate urban climate action. Through its Global Alliance and five sectoral tracks covering buildings and housing, urban energy, waste, mobility and water, the initiative aims to strengthen the recognition of local climate commitments in NDCs and support coordinated implementation. Its objectives also include working with national governments to develop context-specific financing mechanisms, connecting cities with development banks and climate funds, and supporting urban project pipelines. SURGe therefore illustrates how international partnerships can connect national climate ambition with local commitments, sectoral priorities and financing opportunities.',
        'Learn More URL': 'https://unhabitat.org/cop27-presidency-sustainable-urban-resilience-for-the-next-generation-surge',
        'Belongs to Pathway': [pathway11Id]
      }
    },
    // Pathway 1.1 Tools
    {
      fields: {
        'Example Title': 'UN-Habitat – Seizing the Urban Opportunity: A 3-Step Guide for Strengthening NDCs 3.0',
        'Type': 'Tool',
        'Order': 5,
        'What you can learn / Why use this': 'Strengthen national climate commitments by integrating urban priorities, subnational contributions and implementation needs into NDCs through multilevel and cross-sectoral collaboration.',
        'Full Text / Concept Explanation': 'Co-developed by UN-Habitat and SDU Resilience, this guide provides a three-step methodology to assess, prepare and co-design NDCs with stronger urban climate commitments. It helps governments review existing NDCs and national and subnational policies, identify financing opportunities, and strengthen multilevel governance arrangements. It also supports engagement with sector ministries and local stakeholders to align priorities and clarify institutional responsibilities. The co-design process helps governments identify urban mitigation and adaptation actions across sectors and incorporate the finance, technology and capacity-building support needed for implementation into national commitments. The guide can also inform NDC implementation planning and future revisions by helping governments identify relevant urban commitments, responsible actors and remaining gaps.',
        'Learn More URL': 'https://unhabitat.org/seizing-the-urban-opportunity-a-3-step-guide-for-strengthening-nationally-determined-contributions',
        'Belongs to Pathway': [pathway11Id]
      }
    },
    {
      fields: {
        'Example Title': 'UN-Habitat – Urban Content in NDC 3.0: Cities at the Centre',
        'Type': 'Tool',
        'Order': 6,
        'What you can learn / Why use this': 'Understand how urban priorities, sectoral commitments, and implementation arrangements are reflected in NDCs and identify opportunities for improvement.',
        'Full Text / Concept Explanation': 'UN-Habitat\'s analysis examines the urban content of third-generation NDCs. It assesses how national climate plans address cities across mitigation and adaptation sectors, multilevel governance, financing, and implementation. It also examines changes across NDC revision cycles, providing an evidence base for governments seeking to strengthen urban climate commitments.',
        'Learn More URL': 'https://unhabitat.org/urban-content-in-ndc-30-cities-at-the-centre',
        'Belongs to Pathway': [pathway11Id]
      }
    },
    {
      fields: {
        'Example Title': 'Climate Action Aggregation Tool',
        'Type': 'Tool',
        'Order': 7,
        'What you can learn / Why use this': 'This tool shows how subnational climate commitments could contribute to national targets and incorporate them into NDC and investment planning.',
        'Full Text / Concept Explanation': 'Developed by the Initiative for Climate Action Transparency, the Climate Action Aggregation Tool (CAAT) outlines a step-by-step process for national governments to quantify the aggregate GHG impact of climate actions by cities, regions, and other non-state actors. It also accounts for overlaps between actions and national policies. National governments can use CAAT to incorporate subnational action into national climate targets, NDC development, and investment planning.',
        'Learn More URL': 'https://climateactiontransparency.org/icat-toolbox/caat',
        'Belongs to Pathway': [pathway11Id]
      }
    },

    // Pathway 1.2 Peer Learning Examples
    {
      fields: {
        'Example Title': 'Sweden – Viable Cities',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Sweden shows how a national coordination mechanism can enable multilevel coordination around climate action planning, investment, and implementation.',
        'Full Text / Concept Explanation': 'Launched in 2017, Viable Cities coordinates 48 municipalities, six national government agencies, and wider societal actors around a shared climate-neutrality mission. Within Viable Cities, the Climate City Contract 2030 (CCC) provides a core multilevel coordination process. National agencies and municipalities participate in annual cycles linking local climate action and investment needs with national support. Cities also connect transition priorities with investment planning, budgets, and procurement, helping identify where additional financing or national action is needed. Within CCCs, Transition Arenas extend coordination to businesses, academia, and civil society, with Viable Cities providing methods, tools and peer learning for these local collaborations. Viable Cities also has a dedicated Coordination Function that analyzes CCCs to identify local and regional needs, facilitates collaboration between cities and national agencies, and aligns CCC processes with national and EU initiatives. The evolution of Viable Cities has also helped to shape the national coordination approaches under the EU Cities Mission.',
        'Learn More URL': 'https://viablecities.se/en/klimatneutrala-stader-2030/klimatkontrakt/',
        'Belongs to Pathway': [pathway12Id]
      }
    },
    {
      fields: {
        'Example Title': 'Sweden – Viability Fund for Cities',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Sweden shows how a multilevel coordination mechanism is being developed to align different funding sources for urban climate investment portfolios and connect financing with market demand.',
        'Full Text / Concept Explanation': 'The Viability Fund for Cities is an emerging mechanism to coordinate funding from different public and private funders toward urban climate investment portfolios. Building on Sweden\'s Viable Cities experience, it is being developed around three interconnected functions: ALIGN, bringing funders and implementation partners around shared climate transition portfolios and place-based interventions; CO-FINANCE, mobilizing catalytic capital and coordinating contributions from different financing partners toward local investments; and DEMAND, aggregating purchasing demand to shape markets and support deployment of climate solutions. The initiative aims to mobilize EUR 10 billion in co-financing and EUR 10 billion in aggregated demand by 2030, through partnerships across national, subnational, and international levels. Its institutional and financing arrangements remain under development and are intended to be adapted to different country contexts.',
        'Learn More URL': 'https://viabilityfund.org/',
        'Belongs to Pathway': [pathway12Id]
      }
    },
    {
      fields: {
        'Example Title': 'Croatia – National Multilevel Climate and Energy Dialogue',
        'Type': 'Peer Learning Example',
        'Order': 3,
        'What you can learn / Why use this': 'Croatia shows how multilevel coordination can help national governments to identify subnational financing barriers and translate them into new institutional responses.',
        'Full Text / Concept Explanation': 'Between 2022 and 2025, Croatia’s North-West Croatia Regional Energy and Climate Agency (REGEA) facilitated six multilevel climate and energy dialogues involving cities and regions, nine national ministries, businesses, academia, and civil society. Initially focused on Croatia\'s National Energy and Climate Plan, the dialogues evolved to address practical barriers to local implementation, including access to finance. A dedicated dialogue on financing brought municipalities together with the Ministry of Finance and financial-sector actors to discuss how local climate plans could be funded. These discussions led to the creation of the Platform for Sustainable Finance and Energy Transition, providing a space to connect local financing needs with national and financial-sector actors. Croatia is working to institutionalize the multilevel dialogue through an inter-ministerial structure involving national and municipal representatives.',
        'Learn More URL': 'https://eu-mayors.ec.europa.eu/en/The-Covenant-of-Mayors-at-the-heart-of-multilevel-governance-in-Croatia',
        'Belongs to Pathway': [pathway12Id]
      }
    },
    {
      fields: {
        'Example Title': 'Brazil, Kazakhstan and Uzbekistan – CCFLA Local Hubs',
        'Type': 'Peer Learning Example',
        'Order': 4,
        'What you can learn / Why use this': 'CCFLA Local Hubs show how intermediary platforms can support multilevel coordination and connect municipal climate investment priorities with project preparation and financing partners.',
        'Full Text / Concept Explanation': 'CCFLA Local Hub for Kazakhstan and Uzbekistan convened 25 local governments, 10 national agencies, and project preparation partners, including the Gap Fund and FELICITY II, to identify building-decarbonization projects and connect cities with technical support. In Brazil, the Local Hub brings together over 50 local, national and international partners, supporting coordination through a community of practice and the Green and Resilient Cities Programme (PCVR) Project Bank. These arrangements help strengthen connections between municipal investment needs, national institutions, and potential financing partners.',
        'Learn More URL': 'https://citiesclimatefinance.org/the-local-hubs',
        'Belongs to Pathway': [pathway12Id]
      }
    },

    // Pathway 1.3 Peer Learning Examples & Tools
    {
      fields: {
        'Example Title': 'Cameroon – Finance Your Cities Country Platform for Localizing Finance',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Cameroon shows how a country platform can integrate urban investment priorities into the national financial architecture, supported by a domestic financial intermediary.',
        'Full Text / Concept Explanation': 'Announced at COP30, Cameroon’s country platform brings national ministries, local and regional governments and the Special Council Support Fund for Mutual Assistance (FEICOM), Cameroon’s municipal financing institution, around a shared pipeline of climate and development projects. The platform aims to align national policies and investment plans with local climate priorities. FEICOM acts as a financial intermediary between cities and finance providers, aiming to connect local projects with private and international capital, as part of a portfolio approach.',
        'Learn More URL': 'https://www.financeyourcities.org/country-platforms/',
        'Belongs to Pathway': [pathway13Id]
      }
    },
    {
      fields: {
        'Example Title': 'South Africa – Just Energy Transition Partnership (JET-P)',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'South Africa shows how a country platform can integrate municipalities into national investment coordination and support portfolios, project preparation and financing.',
        'Full Text / Concept Explanation': 'South Africa’s Just Energy Transition Partnership mobilizes international support around the country’s transition, guided by its Just Energy Transition Investment and Implementation Plans. Municipalities have a dedicated portfolio within the platform, reflecting their major role in electricity distribution, energy access and local infrastructure. A JET Municipal Council, led by the South African Local Government Association, provides a route for municipal participation in the country platform. It brings together municipal representatives, national ministries, the National Treasury, the Development Bank of Southern Africa (DBSA) and other energy-sector institutions. Through three workstreams covering municipal capability, financing and energy access, the council identifies investment priorities, develops project pipelines and explores financing options for municipal infrastructure. Dedicated programs within the municipal portfolio also support municipalities with project preparation and access to concessional and private finance.',
        'Learn More URL': 'https://justenergytransition.co.za/wp-content/uploads/2026/06/JET-IP-2026-Q1-Progress-Report-final.pdf',
        'Belongs to Pathway': [pathway13Id]
      }
    },
    {
      fields: {
        'Example Title': 'CCFLA’s Urban-Inclusive Country Platforms Framework',
        'Type': 'Tool',
        'Order': 3,
        'What you can learn / Why use this': 'This framework identifies a practical roadmap for integrating urban and subnational priorities, investment pipelines, and financing needs into country platforms.',
        'Full Text / Concept Explanation': 'CCFLA’s framework provides guidance on how a country platform can be designed to systematically integrate cities and subnational priorities into country-platform governance, investment planning, and financing. It addresses common barriers, including misalignment between national and local priorities, weak urban project pipelines, limited fiscal capacity and creditworthiness, and a lack of city-focused financial instruments. The framework’s phased roadmap covers whole-of-government engagement, program readiness, investment programming, financing, and implementation. It identifies practical approaches for engaging cities and subnational governments, strengthening urban investment pipelines, aggregating smaller projects, and connecting them with appropriate financing instruments through national and local financial institutions.',
        'Learn More URL': 'https://citiesclimatefinance.org/publications/integrating-urban-and-subnational-priorities-into-country-platforms',
        'Belongs to Pathway': [pathway13Id]
      }
    }
  ];

  // Batch insert new resources (up to 10 at a time)
  for (let i = 0; i < newResources.length; i += 10) {
    const chunk = newResources.slice(i, i + 10);
    await airtableRequest('Key%20Resources', 'POST', { records: chunk });
  }
  console.log(`Created ${newResources.length} new resources/examples.`);

  console.log("=== ACTION 1 AIRTABLE UPDATE COMPLETED SUCCESSFULLY ===");
}

main().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
