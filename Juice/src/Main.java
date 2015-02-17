import java.io.*;
import java.util.*;
public class Main {
    static ComponentsComparator cc = new ComponentsComparator();
    static JuiceComparator jc = new JuiceComparator();
    ArrayList<String> allComponents = new ArrayList<String>();
    ArrayList<ArrayList<Integer>> graph;
    int [] paths;
    boolean [] visited;

    public static void main(String [] args) throws IOException{
        new Main().process();
    }

    void process() throws IOException{
        ArrayList<Juice> juices = new ArrayList<Juice>();
        ArrayList<String> components = new ArrayList<String>();

        BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream("juice.in")));
        String tmp = new String();
        while((tmp = br.readLine()) != null){
            StringTokenizer st = new StringTokenizer(tmp);
            Juice juice = new Juice();
            while(st.hasMoreTokens()){
                String temp = st.nextToken();
                if(!isRead(components,temp))
                    components.add(temp);
                allComponents.add(temp);
                juice.addComponent(temp);
            }
            juices.add(juice);
        }

        SortThread sortThread = new SortThread();
        sortThread.start();
        outComponents(components);
        try{
            sortThread.join();
        }
        catch(InterruptedException e){
            e.printStackTrace();
        }
        outSortedComponents(allComponents);
        Collections.sort(juices,jc);
        int washCount = getWashCount(juices);
        outWashCount(washCount);
    }

    static class ComponentsComparator implements Comparator{
        public int compare(Object o1, Object o2){
            return ((String)o1).compareTo(((String)o2));
        }
    }

    class SortThread extends Thread{
        @Override
        public void run(){
            Collections.sort(allComponents,cc);
        }
    }

    static class JuiceComparator implements Comparator{
        public int compare(Object o1, Object o2){
            return ((Juice)o1).getComponentsCount() - ((Juice)o2).getComponentsCount();
        }
    }

    int getWashCount(ArrayList<Juice> data){
        int result = 0;

        makeMatrix(data);
        paths = new int[data.size()];
        for(int i = 0; i < paths.length; i++)
            paths[i] = -1;
        visited = new boolean[data.size()];

        for(int v = 0; v < data.size(); v++){
            for(int i = 0; i < visited.length; i++)
                visited[i] = false;
            step(v);
        }

        for(int i = 0; i < paths.length; i++)
            if(paths[i] == -1)
                result++;

        return result;
    }

    void makeMatrix(ArrayList<Juice> data){
        graph = new ArrayList<ArrayList<Integer>>();
        TreeSet<Integer> temp = new TreeSet<Integer>();
        for(int i = 0; i < data.size(); i++){
            for(int j = i + 1; j < data.size(); j++){
                if(data.get(j).getComponents().containsAll(data.get(i).getComponents())){
                    temp.add(j);
                }
            }
            graph.add(new ArrayList<Integer>(temp));
            temp.clear();
        }
    }

    boolean step(int v){
        if(visited[v])
            return false;
        visited[v] = true;
        for(int i = 0; i < graph.get(v).size(); ++i){
            int to = graph.get(v).get(i);
            if(paths[to] == -1 || step(paths[to])){
                paths[to] = v;
                return true;
            }
        }
        return false;
    }

    void outSortedComponents(ArrayList<String> data) throws IOException{
        PrintWriter pw = new PrintWriter("juice2.out");
        for(int i = 0; i < data.size(); i++){
            pw.println(data.get(i));
        }
        pw.close();
    }

    void outComponents(ArrayList<String> data) throws IOException{
        PrintWriter pw = new PrintWriter("juice1.out");
        for(int i = 0; i < data.size(); i++){
            pw.println(data.get(i));
        }
        pw.close();
    }

    boolean isRead(ArrayList<String> data, String item){
        for(int i = 0; i < data.size(); i++){
            String temp = data.get(i);
            boolean flag = temp.equalsIgnoreCase(item);
            if(flag == true)
                return true;
        }
        return false;
    }

    void outWashCount(int washCount) throws IOException{
        PrintWriter pw = new PrintWriter("juices3.out");
        pw.println(washCount);
        pw.close();
    }
}

class Juice{
    private ArrayList<String> components;

    public Juice(){
        components = new ArrayList<String>();
    }

    public void addComponent(String item){
        components.add(item);
    }

    public ArrayList<String> getComponents(){
        ArrayList<String> result = new ArrayList<String>(components);
        return result;
    }

    public int getComponentsCount(){
        return components.size();
    }
}